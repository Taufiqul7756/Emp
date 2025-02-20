import * as crypto from "crypto";

const encryptData = (data: object): string => {
  const jsonData: string = JSON.stringify(data);

  const key: Buffer = Buffer.from("thisIsAverySpecialSecretKey00000", "utf8");
  const iv: Buffer = Buffer.from("1583288699248111", "utf8");

  const cipher: crypto.Cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encryptedData: string = cipher.update(jsonData, "utf8", "base64");
  encryptedData += cipher.final("base64");
  return encryptedData;
};

export default encryptData;
