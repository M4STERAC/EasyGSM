import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
// import WelcomeBack from './pages/WelcomeBack';
// import CreateFlashCard from './pages/CreateFlashCard';
// import RootLayout from './pages/RootLayout';
// import ViewFlashCardSet from './pages/ViewFlashCardSet';
// import FlashCardSetList from './pages/FlashCardSetList';
// import NoteTopicList from './pages/NoteTopicList';
// import ViewNoteTopic from './pages/ViewNoteTopic';

const router = createBrowserRouter([
  {
    path: '/',
    // element: <RootLayout />,
    // children: [
      // { path: '/', element: <WelcomeBack /> },
      // { path: '/flashcards', element: <FlashCardSetList /> },
      // { path: '/flashcards/:viewFlashcardSet', element: <ViewFlashCardSet /> },
      // { path: '/flashcards/:viewFlashcardSet/create', element: <CreateFlashCard /> },
      // { path: '/notes', element: <NoteTopicList /> },
      // { path: '/notes/:viewNoteTopic', element: <ViewNoteTopic /> }
    // ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
