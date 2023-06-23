import { Image } from "@chakra-ui/react";
import { getImageUrl } from "../../../helper";

export function ShowImage( { image, userEmail }: { image: string, userEmail: string } ) {
   return (
       <Image src={ getImageUrl(image, userEmail) }
              w={1000}
              rounded={ 15 }/>
   );
}