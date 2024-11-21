export interface IConvictProps {
  env: string;
  server: {
    port: string;
  };
  mongoose: {
    uri: string;
    database: string;
  };
  jwt: {
    secretKeys: {
      authenticateUserSecretKey: string;
      refreshTokenSecretKey: string;
    };
  };
  hostUserCredentials: {
    email: { value: string; };
    password: string;
  };
  aws: {
    s3: {
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
      bucketName: {
        userProfileImage: string;
        mainImage: string;
        galleryImages: string;
      };
    }
  }
}
