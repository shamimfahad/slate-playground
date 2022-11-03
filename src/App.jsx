import './App.css';

import EditableVoidsExample from 'components/slateEditor/editableVoids';
import HoveringMenuExample from 'components/slateEditor/hoveringToolbar';

const App = () => {
  return (
    <div className='App'>
      <h3 className='App-header'>App</h3>
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        {/* <div className='card'>
          <Editor />
        </div>
        <div className='card'>
          <h3>Rich Text</h3>
          <RichTextExample />
        </div> */}
        <div className='card'>
          <h3>Editable Voids</h3>
          <EditableVoidsExample />
        </div>
        <div className='card'>
          <HoveringMenuExample />
        </div>
      </div>
    </div>
  );
};

export default App;
