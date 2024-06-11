import {v4 as uuid} from 'uuid'

export const fileNamer=(req:Express.Request,
                        file:Express.Multer.File,
                        calback:Function)=>{

  if(!file) return calback(new Error('files is emty'),false);   

  const fileExptension= file.mimetype.split('/')[1];

  const fileName=`${uuid()}.${fileExptension}`;
  
  return calback(null,fileName);                          
}