//Upload image to s3 bucket.

//import S3 from 'aws-sdk/clients/s3';
import { uuid } from 'uuidv4';
import { Buffer } from 'buffer';
import { v4 } from 'uuid';
import axios from 'axios';
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @params file: string (base64) image file
export const uploadImage = async (image: string) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(image, {});
    return uploadResponse.url;
  } catch (err) {
      console.error(err);
      return null;
  }


  // try {
  //   // const s3 = new S3({
  //   //   accessKeyId: process.env.AWSACCESS_KEY,
  //   //   secretAccessKey: process.env.AWSSECRET_KEY,
  //   // });
  //const base64Data = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  //   const type = image.split(';')[0].split('/')[1];

  //   const params = {
  //     Bucket: process.env.AWSBucket,
  //     Key: `${v4()}.${type}`,
  //     Body: base64Data,
  //     ContentEncoding: 'base64',
  //     ContentType: `image/${type}`,
  //   };

  //   //const { Location } = await s3.upload(params).promise();
  //   return "";//Location;
  // } catch (error) {
  //   return null;
  // }
  // try {
  //   const src = image.replace(/^data:image\/\w+;base64,/, '');

  //   let obj = {
  //     key: `${process.env.IMGCDN_API_KEY}`,
  //     source: src,
  //     format: 'json'
  //   };
  //   console.log(`${process.env.IMGCDN_API_KEY}`);
  //   let js = JSON.stringify(obj);
  //   await fetch(`${process.env.CLOUDINARY_URL}`, {method:'POST',body:js}).then(async ret => {
  //     let res = JSON.parse(await ret.text());
  //     if (res.Error)
  //     {
        
  //     }
  //     console.log(res);
  //   });





    // const response = await axios.post(
    //   `http://imgcdn.dev/api/1/upload/`,
    //   {
    //     key: `${process.env.IMGCDN_API_KEY}`,
    //     source: src,
    //     format: 'json'
    //   }
    // );
    //console.log(response);
    //return response;
  // } catch (error) {
  //   console.error(error);
  //   return false;
  // }
};
