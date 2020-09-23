"use strict"

class BaseModel{
  constructor(data, msg){
    if(typeof data == 'string'){
      this.msg = data;
      data = null;
      msg = null;
    }
    if(data){
      this.data = data;
    }
    if(msg){
      this.msg = msg;
    }
  }
}

class SuccessModel extends BaseModel{
  constructor(data, msg){
    super(data, msg);
    this.errorCode = 0;
  }
}

class ErrorModel extends BaseModel{
  constructor(data, msg){
    super(data, msg);
    this.errorCode = -1;
  }
}

WXZ.Namespace.reg('WXZ.Model.Response')

WXZ.Model.Response = {
  SuccessModel,
  ErrorModel,
}
