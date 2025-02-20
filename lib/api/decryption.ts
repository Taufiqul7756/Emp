import * as crypto from "crypto";

const decryptData = (encryptedData: string): object | null => {
  const key: Buffer = Buffer.from("thisIsAverySpecialSecretKey00000", "utf8");
  const iv: Buffer = Buffer.from("1583288699248111", "utf8");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  try {
    let decryptedData = decipher.update(encryptedData, "base64", "utf8");
    decryptedData += decipher.final("utf8");

    return JSON.parse(decryptedData);
  } catch (error) {
    // console.error("Decryption error:", error);
    return null;
  }
};

export default decryptData;
