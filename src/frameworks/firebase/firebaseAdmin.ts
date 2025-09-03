import admin from "firebase-admin";
import { config } from "../../shared/config";

const serviceAccountKeyJson = config.firebase.service_account_key_json;

export class FirebaseAdminConfig {
  static initialize() {
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(serviceAccountKeyJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("firebase admin initialized");
    }
  }

  static getInstance() {
    console.log(serviceAccountKeyJson);
    FirebaseAdminConfig.initialize();
    return admin;
  }
}
