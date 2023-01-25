//Upload image to s3 bucket. 

import AWS from 'aws-sdk'
import { uuid } from "uuidv4";
import { Buffer } from 'buffer';

// @params file: string (base64) image file
export const uploadImage = async (image: string) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWSACCESS_KEY,
        secretAccessKey: process.env.AWSSECRET_KEY,
    })

    
    try {

        const base64Data = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const type = image.split(';')[0].split('/')[1];

        const params = {
            Bucket:  process.env.AWSBucket,
            Key: `${uuid()}.${type}`,
            Body: base64Data,
            ContentEncoding: 'base64',
            ContentType: `image/${type}`
        };

        const { Location } = await s3.upload(params).promise();
        return Location;

    } catch (error) {
        console.log(error)
        return null;
    }
}