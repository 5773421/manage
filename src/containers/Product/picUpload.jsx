import { Upload, Icon, Modal, message } from 'antd';
import {Component } from 'react'
import {BASEURL} from '../../config'
import {reqDeleteImg} from '../../api'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicUpload extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  }
  getImgArr = ()=>{
    return this.state.fileList.map(item=>item.name)
  }
  setImgObj = (imgs)=>{
    let fileList = imgs.map((item)=>{
      return {
        uid:item,
        name:item,
        url:`${BASEURL}/upload/${item}`
      }
    })
    this.setState({fileList})
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async({file,fileList }) => {
    if(file.status === 'done'){
      console.log(fileList)
      const {status,data} = file.response
      fileList[fileList.length-1].url = data.url
      fileList[fileList.length-1].name = data.name
      if(!status){
        message.success('图片上传成功',1)
      }
      else {
        message.error('图片上传失败',1)
        fileList.pop() //若上传失败，也取消展示
      }
    }
    if(file.status === 'removed'){
      let result = await reqDeleteImg(file.name)
      if(!result.status) message.success('删除图片成功',1)
      else message.error('删除图片失败',1)
    }
    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={`${BASEURL}/manage/img/upload`}
          name='image'
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicUpload