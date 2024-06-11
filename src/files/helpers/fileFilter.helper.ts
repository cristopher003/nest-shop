export const fileFilter=(req:Express.Request,
                        file:Express.Multer.File,
                        calback:Function)=>{

  if(!file) return calback(new Error('filexx is emty'),false);     
  const fileExptension= file.mimetype.split('/')[1];
  const validExptension=['jpg','png','jpeg'];
  if(validExptension.includes(fileExptension)) {
    return calback(null,true);
  }
  return calback(new Error('filecc is emty'),false);                          
}