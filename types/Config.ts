export interface Config {
  apiUrl: string;
  makeApiUrl: (path: string, base?: string) => string; // updated for multiple url support
}

// for development only
const apiUrl = "https://apiambufast.taldev.xyz";

const config: Config = {
  apiUrl,
  makeApiUrl: (path: string, base: string = apiUrl) => {
    return base + path;
  },
};
export default config;
