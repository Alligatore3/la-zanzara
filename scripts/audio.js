const FILE_SYSTEM = require("fs");
const META_DATA = require("music-metadata");
const ABSOLUTE_AUDIOS_PATH = "./src/assets/audios";

/**
 * @constant
 * @name readAllMetadatas
 * @description Given a first level folder, we filter only mp3 audios
 * Then we perform the parsification.
 * @param {Array} list
 * @returns {Promise}
 */
const readAllMetadata = list => {
  const onlyMP3 = list.filter(a => a.indexOf(".mp3") >= 0);
  return parseFiles(onlyMP3).then(generateJSON);
};

/**
 * @description Foreach audios we retrieves relative metadata.
 * @see https://github.com/borewit/music-metadata#parsefile-function
 * @returns {Promise}
 */
const parseFiles = audioFiles => {
  const audiosWithMeta = audioFiles.map(async audioFile => {
    const { common } = await META_DATA.parseFile(
      `${ABSOLUTE_AUDIOS_PATH}/${audioFile}`
    );

    return {
      name: audioFile,
      metadata: common
    };
  });

  return Promise.all(audiosWithMeta);
};

/**
 * @description Due to git behaviour to not commit
 * empty folder, we have to check if exists or nah.
 */
const generateJSON = audiosWithMeta => {
  /**
   * @param {String} path The path of the file to write data to
   * @param {String} data The the data to write
   * Note that if the file doesn't already exist, then a new file is created for you.
   * @see https://stackabuse.com/reading-and-writing-json-files-with-node-js/#writingjsontoafile
   */
  FILE_SYSTEM.writeFileSync("audios.json", JSON.stringify(audiosWithMeta));

  const whereToMove = `${ABSOLUTE_AUDIOS_PATH}/asJSON/`
  /**
   * @see https://stackoverflow.com/a/26815894
   */
  if (!FILE_SYSTEM.existsSync(whereToMove)){
    FILE_SYSTEM.mkdirSync(whereToMove);
    moveJSONInProperPath(whereToMove)
  } else {
    moveJSONInProperPath(whereToMove)
  }
};

const moveJSONInProperPath = where => {
  /**
   * @description Asynchronously rename file at oldPath to the pathname provided as newPath.
   * In the case that newPath already exists, it will be overwritten.
   * @see https://nodejs.org/docs/latest/api/fs.html#fs_fs_rename_oldpath_newpath_callback
   */
  return FILE_SYSTEM.rename(
      "audios.json",
      `${where}/audios.json`,
      err => {
        if (err) throw err;
      }
  );
}

FILE_SYSTEM.readdir(ABSOLUTE_AUDIOS_PATH, (err, files) =>
  readAllMetadata(files)
);
