
'use client';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  increment,
  runTransaction,
  onSnapshot,
  writeBatch,
  where,
  collectionGroup,
} from 'firebase/firestore';
import { db, storage } from './firebase';
import type { User, Question, Answer, QuestionWrite, AnswerWrite, AnalyticsData } from '@/types';
import { Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

// Helper to convert Firestore Timestamps to Dates in objects, including nested objects and arrays
function convertTimestampsToDates<T>(data: any): T {
    if (data === null || typeof data !== 'object') {
        return data;
    }

    if (data instanceof Timestamp) {
        return data.toDate() as any;
    }
    
    if (Array.isArray(data)) {
        return data.map(item => convertTimestampsToDates(item)) as any;
    }

    const newData: { [key: string]: any } = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            newData[key] = convertTimestampsToDates(data[key]);
        }
    }
    return newData as T;
}

// Real-time listener for questions
export const onQuestionsSnapshot = (
  onUpdate: (questions: Question[]) => void,
  onError: (error: Error) => void
) => {
  const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty && !querySnapshot.metadata.hasPendingWrites) {
      // If there are no questions, seed the database.
      seedInitialData().then(() => {
         // The listener will be re-triggered after seeding
      }).catch(err => {
        console.error("Error seeding data: ", err);
        onUpdate([]); // Send back empty array on error
      });
    } else {
      const questions: Question[] = [];
      querySnapshot.forEach(doc => {
        const data = convertTimestampsToDates<Question>(doc.data());
        questions.push({ ...data, id: doc.id });
      });
      onUpdate(questions);
    }
  }, (error) => {
    console.error("Error getting real-time questions: ", error);
    onError(error);
  });

  return unsubscribe;
};

// Real-time listener for a single question and its answers
export const onQuestionSnapshot = (
    id: string,
    onUpdate: (question: Question | null) => void,
    onError: (error: Error) => void
) => {
    const docRef = doc(db, 'questions', id);
    
    // Increment view count
    updateDoc(docRef, { views: increment(1) }).catch(e => console.error("Failed to increment view count", e));

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const questionData = convertTimestampsToDates<Question>(docSnap.data());
            questionData.id = docSnap.id;

            // Also listen to answers subcollection
            const answersCol = collection(docRef, 'answers');
            const answersQuery = query(answersCol, orderBy('score', 'desc'), orderBy('createdAt', 'asc'));

            onSnapshot(answersQuery, (answersSnapshot) => {
                const answers: Answer[] = [];
                answersSnapshot.forEach(answerDoc => {
                    answers.push({ ...convertTimestampsToDates<Answer>(answerDoc.data()), id: answerDoc.id });
                });
                questionData.answers = answers;
                onUpdate({ ...questionData });
            }, (error) => {
                console.error("Error getting real-time answers: ", error);
                // We might still want to update the question data even if answers fail
                onUpdate(questionData);
            });
        } else {
            onUpdate(null);
        }
    }, (error) => {
        console.error("Error getting real-time question: ", error);
        onError(error);
    });

    return unsubscribe;
};

export const addQuestion = async (question: QuestionWrite): Promise<Question> => {
  const docRef = await addDoc(collection(db, 'questions'), {
    ...question,
    createdAt: serverTimestamp(),
    score: 0,
    votes: {},
    views: 0,
  });

  // Update user's score if they are not anonymous
  if (question.author.uid !== 'anonymous') {
    const userRef = doc(db, 'users', question.author.uid);
    await updateDoc(userRef, {
        score: increment(2) // 2 points for asking a question
    });
  }

  const newQuestionSnap = await getDoc(docRef);
  const newQuestion = convertTimestampsToDates<Question>(newQuestionSnap.data());
  return { ...newQuestion, id: docRef.id, answers: [] };
};


export const addAnswer = async (questionId: string, answer: AnswerWrite): Promise<Answer> => {
    const questionRef = doc(db, 'questions', questionId);
    const answerCol = collection(questionRef, 'answers');

    const answerRef = await addDoc(answerCol, {
        ...answer,
        createdAt: serverTimestamp(),
        score: 0,
        votes: {},
    });

    // Update user's score only if they are not anonymous
    if (answer.author.uid !== 'anonymous') {
        const userRef = doc(db, 'users', answer.author.uid);
        await updateDoc(userRef, {
            score: increment(5) // 5 points for answering
        });
    }


    const newAnswerSnap = await getDoc(answerRef);
    const newAnswer = convertTimestampsToDates<Answer>(newAnswerSnap.data());
    return { ...newAnswer, id: newAnswerSnap.id };
};


export const getLeaderboard = async (): Promise<User[]> => {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, orderBy('score', 'desc'));
    const querySnapshot = await getDocs(q);
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
        users.push({ ...(doc.data() as User), uid: doc.id });
    });
    return users;
};

export const getMentors = async (): Promise<User[]> => {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where('isMentor', '==', true), orderBy('displayName', 'asc'));
    let querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        await seedInitialData();
        querySnapshot = await getDocs(q);
    }

    const mentors: User[] = [];
    querySnapshot.forEach((doc) => {
        mentors.push({ ...(doc.data() as User), uid: doc.id });
    });
    return mentors;
}

export const getUserProfile = async (uid: string): Promise<User | null> => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return convertTimestampsToDates<User>(docSnap.data());
    }
    return null;
}

export const createUserProfile = async (user: User): Promise<void> => {
    const userRef = doc(db, 'users', user.uid);
    await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(userRef);
        if (!sfDoc.exists()) {
            transaction.set(userRef, {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                score: user.score ?? 0,
                isMentor: user.isMentor ?? false
            });
        }
    });
}

// Data seeding function
async function seedInitialData() {
    console.log("Checking if seeding is needed...");
    const questionsQuery = query(collection(db, 'questions'));
    const questionsSnapshot = await getDocs(questionsQuery);
    
    const mentorsQuery = query(collection(db, 'users'), where('isMentor', '==', true));
    const mentorsSnapshot = await getDocs(mentorsQuery);

    if (!questionsSnapshot.empty && !mentorsSnapshot.empty) {
        console.log("Data already exists. Skipping seed.");
        return;
    }
    
    console.log("Seeding initial data...");

    const batch = writeBatch(db);

    // Sample Users
    const users: User[] = [
        { uid: 'user-1', displayName: 'Alex Doe (Mobile Dev)', photoURL: `https://api.dicebear.com/8.x/adventurer/png?seed=Alex`, score: 15, isMentor: true },
        { uid: 'user-2', displayName: 'Jane Smith (Firebase)', photoURL: `https://api.dicebear.com/8.x/adventurer/png?seed=Jane`, score: 25, isMentor: true },
        { uid: 'user-3', displayName: 'Sam Wilson', photoURL: `https://api.dicebear.com/8.x/adventurer/png?seed=Sam`, score: 5, isMentor: false },
        { uid: 'user-4', displayName: 'Chris Lee (GenAI)', photoURL: `https://api.dicebear.com/8.x/adventurer/png?seed=Chris`, score: 30, isMentor: true },
        { uid: 'user-5', displayName: 'Pat Kim (Web Dev)', photoURL: `https://api.dicebear.com/8.x/adventurer/png?seed=Pat`, score: 50, isMentor: true },
        { uid: 'user-6', displayName: 'Taylor Brown (UI/UX)', photoURL: `https://api.dicebear.com/8.x/adventurer/png?seed=Taylor`, score: 42, isMentor: true },
        { uid: 'user-7', displayName: 'Morgan Riley (Backend)', photoURL: `https://api.dicebear.com/8.x/adventurer/png?seed=Morgan`, score: 38, isMentor: true },
        { uid: 'user-8', displayName: 'Casey Jordan (Product)', photoURL: `https://api.dicebear.com/8.x/adventurer/png?seed=Casey`, score: 22, isMentor: true },
        { uid: 'user-9', displayName: 'Jamie Rivera', photoURL: `https://api.dicebear.com/8.x/adventurer/png?seed=Jamie`, score: 12, isMentor: false },
    ];

    users.forEach(user => {
        const userRef = doc(db, 'users', user.uid);
        batch.set(userRef, user);
    });

    // Sample Questions with Answers
    const questionsToSeed = [
        { 
            question: { title: "How to structure Firestore data for a social media app?", content: "I'm building a social media app and I'm not sure about the best way to structure my Firestore data for posts, comments, and likes. What are the best practices?", tags: ["firebase", "firestore"], author: users[2], createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), score: 2, votes: {'user-1': 'up', 'user-4': 'up'}, views: 150 },
            answers: [
                { author: users[1], content: "You should use subcollections for comments and likes to keep your documents small and queries efficient.", createdAt: new Date(Date.now() - 1 * 23 * 60 * 60 * 1000), score: 1, votes: {'user-4': 'up'} },
                { author: users[4], content: "Also consider duplicating some data to avoid complex queries. For example, store the author's username on the post itself.", createdAt: new Date(Date.now() - 1 * 22 * 60 * 60 * 1000), score: 0, votes: {} },
            ]
        },
        { 
            question: { title: "What is the best way to handle state in a large Flutter application?", content: "My Flutter app is growing and I'm finding it hard to manage state. I've looked at Provider, BLoC, and Riverpod. Which one is recommended for scalability?", tags: ["flutter", "state-management"], author: users[8], createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), score: 1, votes: {'user-0': 'up'}, views: 75 },
            answers: [
                { author: users[0], content: "For large applications, Riverpod is often recommended due to its compile-safe nature and improved testability over Provider.", createdAt: new Date(Date.now() - 2 * 20 * 60 * 60 * 1000), score: 0, votes: {} }
            ]
        },
        { 
            question: { title: "How do I use Genkit with Next.js for AI-powered features?", content: "I want to integrate AI features into my Next.js app using Genkit. Can someone provide a simple example of how to set up a basic flow and call it from a React component?", tags: ["ai", "genkit", "nextjs"], author: users[2], createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), score: 1, votes: {'user-3': 'up'}, views: 230 },
            answers: [
                { author: users[3], content: "Genkit flows can be defined as server actions in Next.js. You just need to import the flow and call it directly from your client components.", createdAt: new Date(Date.now() - 3 * 10 * 60 * 60 * 1000), score: 0, votes: {} }
            ]
        },
        { 
            question: { title: "Hackathon prize API integration problem", content: "I'm trying to connect to the prize API for the hackathon but I'm getting a 403 error. Has anyone else seen this? I'm using the correct API key.", tags: ["hackathon", "api", "firebase"], author: users[8], createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), score: 1, votes: {'user-1': 'up'}, views: 50 },
            answers: [
                { author: users[1], content: "Hey! Mentor here. Make sure you're setting the `Authorization` header correctly. It should be `Bearer YOUR_API_KEY`. Let me know if that helps!", createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), score: 1, votes: {'user-8': 'up'} }
            ]
        },
    ];
    if (questionsSnapshot.empty) {
        questionsToSeed.forEach(({ question, answers }) => {
            const questionRef = doc(collection(db, 'questions'));
            batch.set(questionRef, { ...question, createdAt: Timestamp.fromDate(question.createdAt) });
            
            answers.forEach(answer => {
                const answerRef = doc(collection(questionRef, 'answers'));
                batch.set(answerRef, { ...answer, createdAt: Timestamp.fromDate(answer.createdAt) });
            });
        });
    }


    await batch.commit();
    console.log("Initial data seeded successfully.");
}

export const handleVote = async (
  collectionPath: 'questions' | 'answers',
  docId: string,
  userId: string,
  voteType: 'up' | 'down',
  questionId?: string
) => {
  const docRef = questionId 
    ? doc(db, 'questions', questionId, 'answers', docId) 
    : doc(db, 'questions', docId);

  await runTransaction(db, async (transaction) => {
    const docSnap = await transaction.get(docRef);
    if (!docSnap.exists()) {
      throw new Error("Document does not exist!");
    }

    const data = docSnap.data();
    const votes = data.votes || {};
    const currentVote = votes[userId];
    const authorId = data.author.uid;

    // Don't update score for anonymous authors or if they vote on their own post
    if (authorId === 'anonymous' || authorId === userId) {
      return;
    }
    
    const userRepRef = doc(db, 'users', authorId);

    let scoreModifier = 0;
    let userRepModifier = 0;

    const newVotes = { ...votes };

    if (currentVote === voteType) {
      // User is undoing their vote
      delete newVotes[userId];
      scoreModifier = voteType === 'up' ? -1 : 1;
      userRepModifier = voteType === 'up' ? -1 : 1;
    } else if (currentVote) {
      // User is changing their vote
      newVotes[userId] = voteType;
      scoreModifier = voteType === 'up' ? 2 : -2;
      userRepModifier = voteType === 'up' ? 2 : -2;
    } else {
      // User is casting a new vote
      newVotes[userId] = voteType;
      scoreModifier = voteType === 'up' ? 1 : -1;
      userRepModifier = voteType === 'up' ? 1 : -1;
    }

    transaction.update(docRef, {
      score: increment(scoreModifier),
      votes: newVotes,
    });

    transaction.update(userRepRef, {
        score: increment(userRepModifier)
    });

  });
};

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
    const questionsSnapshot = await getDocs(collection(db, 'questions'));
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const answersSnapshot = await getDocs(collectionGroup(db, 'answers'));

    const totalQuestions = questionsSnapshot.size;
    const totalUsers = usersSnapshot.size;
    const totalAnswers = answersSnapshot.size;

    let totalAiAnswers = 0;
    const tagCounts: { [key: string]: number } = {};
    
    questionsSnapshot.forEach(doc => {
        const question = doc.data() as Question;
        question.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    answersSnapshot.forEach(doc => {
        const answer = doc.data() as Answer;
        if (answer.isAiSuggestion) {
            totalAiAnswers++;
        }
    });

    return {
        totalQuestions,
        totalUsers,
        totalAnswers,
        totalAiAnswers,
        tagCounts,
    };
};

export const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `question-images/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

export const getQuestionsWithImages = async (): Promise<Question[]> => {
    const q = query(
        collection(db, 'questions'), 
        where('imageUrl', '!=', null),
        orderBy('imageUrl'),
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const questions: Question[] = [];
    querySnapshot.forEach((doc) => {
        questions.push({ ...convertTimestampsToDates<Question>(doc.data()), id: doc.id });
    });
    return questions;
};
