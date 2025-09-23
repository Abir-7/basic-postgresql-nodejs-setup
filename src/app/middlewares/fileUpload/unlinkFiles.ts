import fs from "fs";
import path from "path";

const unlinkFile = (file: string) => {
  const file_path = path.join("uploads", file);

  if (fs.existsSync(file_path)) {
    fs.unlinkSync(file_path);
  }
};

export default unlinkFile;
