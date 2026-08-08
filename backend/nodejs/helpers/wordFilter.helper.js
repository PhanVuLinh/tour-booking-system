const BAD_WORDS_LIST = [
  "đm",
  "dkm",
  "dm",
  "vl",
  "vcl",
  "vkl",
  "đcl",
  "cl",
  "lồn",
  "cac",
  "cặc",
  "buồi",
  "óc chó",
  "chó đẻ",
  "mẹ kiếp",
  "đồ ngu",
  "lừa đảo",
  "lua dao",
  "fuck",
  "shit",
  "bitch",
  "asshole",
];

module.exports.checkBadWords = (text) => {
  if (!text || typeof text !== "string") {
    return { hasBadWords: false, badWordsFound: [] };
  }

  const normalizedText = text.toLowerCase();
  const badWordsFound = [];

  for (const word of BAD_WORDS_LIST) {
    if (normalizedText.includes(word.toLowerCase())) {
      badWordsFound.push(word);
    }
  }

  return { hasBadWords: badWordsFound.length > 0, badWordsFound };
};

