import { TypedOnChange2 } from "../interface";
import { userAsyncActions } from "../store/slice";
import { useAppDispatch } from "../hook";

export const avatarService = () => {
   const dispatch = useAppDispatch();

   const uploadAvatar = async ( e: TypedOnChange2 ) => {
      const image = (e.target.files as FileList)[0];
      const formData = new FormData();
      formData.append( "avatar", image );

      await dispatch( userAsyncActions.uploadAvatar( formData ) );
   };

   const deleteAvatar = async () => dispatch( userAsyncActions.deleteAvatar() );

   return { uploadAvatar, deleteAvatar };

};