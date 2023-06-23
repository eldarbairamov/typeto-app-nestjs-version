export const pleaseWait = ( ms: number ) => {
   return new Promise(( resolve ) => {
      setTimeout(resolve, ms);
   });
};