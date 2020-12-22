import React, { Component } from 'react';
import { EditorState, convertToRaw,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

class RichTextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  setRichText = (detail)=>{
    const contentBlock = htmlToDraft(detail)
    if(contentBlock){
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      })
    }
  }
  getRichText = ()=>{
    const { editorState } = this.state;
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorStyle={{border:'black 1px solid',minHeight:'200px',paddingLeft:'20px'}}
          onEditorStateChange={this.onEditorStateChange}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}

export default RichTextEditor