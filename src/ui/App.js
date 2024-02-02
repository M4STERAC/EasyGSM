import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/flashcards" component={FlashCardSetList} exact />
        <Route path="/flashcards/:viewFlashcardSet" component={ViewFlashCardSet} exact />
        <Route path="/flashcards/:viewFlashcardSet/create" component={CreateFlashCard} exact />
        <Route path="/notes" component={NoteTopicList} exact />
      </Switch>
    </Router>
  );
}

export default App;