import { cloudinary } from "../../infrastructure/config/cloudinary/cloudinary.donfig";

export async function generateSignedUrl(
  publiceId: string,
  expiresInSec = 300
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000) + expiresInSec;

  const url = cloudinary.url(publiceId, {
    type: "authenticated",
    sign_url: true,
    secure: true,
    expires_at: timestamp,
  });

  return url;
}
