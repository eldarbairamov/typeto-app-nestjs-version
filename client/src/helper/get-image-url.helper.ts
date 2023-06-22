export const getImageUrl = ( imageName: string | null, email: string ) => {
   if (imageName) return `http://localhost:3100/${email}/${ imageName }`;
};