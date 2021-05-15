export const handleIcon = (data) => {
  //console.log(data);
  if (data.type === 'folder')
    return 'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1614057434/folder-icon_uv8y4m.png';
  else {
    if (data.name == 'terminal' && data.type == 'exe')
      return 'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1614061685/terminal-icon_ac2sdv.png';
    if (data.name == 'MagicBall' && data.type == 'webapp')
      return 'https://res.cloudinary.com/drolmjcot/image/upload/v1616249934/magicball_coq09r.png';
    if (data.name == 'VsCode' && data.type == 'exe')
      return 'https://res.cloudinary.com/drolmjcot/image/upload/v1620290109/icons8-visual-studio-code-2019-48_ibprxf.png';

    if (data.name == 'Spotify' && data.type == 'exe')
      return 'https://res.cloudinary.com/drolmjcot/image/upload/v1620291916/spotify-logo-png-7053_vfxytw.png';
    if (data.name == 'Todoist' && data.type == 'exe')
      return 'https://res.cloudinary.com/drolmjcot/image/upload/v1620292427/todoist_logo_icon_144800_ohrjnz.png';

    if (data.type == 'txt')
      return 'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1614060786/ba31ac1ab88b5c17cc84283621a6e702_m4cirp.png';
    if (data.type == 'webapp')
      return 'https://res.cloudinary.com/drolmjcot/image/upload/v1615476171/web-app-icon-7_pkp4ya.png';
    if (data.type == 'pdf') return 'https://res.cloudinary.com/drolmjcot/image/upload/v1616140963/pdf_e7pqp9.png';
    if (data.type == 'html') return 'https://res.cloudinary.com/drolmjcot/image/upload/v1616164191/html_w3xgjp.png';
    if (data.type == 'png' || data.type == 'jpeg' || data.type == 'jpg')
      return 'https://res.cloudinary.com/drolmjcot/image/upload/v1616164422/image_puwasn.png';
    if (data.type == 'mp4') return 'https://res.cloudinary.com/drolmjcot/image/upload/v1616247561/audio_rjkner.png';
    if (data.type == 'mp3' || data.type == 'mpeg')
      return 'https://res.cloudinary.com/drolmjcot/image/upload/v1616248616/audio-file_b61wad.png';
    if (data.type == 'xlsx')
      return 'https://res.cloudinary.com/drolmjcot/image/upload/v1616477472/xls-icon-3379_czizkl.png';
  }
};

export const checkFileType = (fileType) => {
  const supportedTypes = [
    'application/pdf',
    'text/html',
    'video/mp4',
    'image/jpeg',
    'image/png',
    'audio/mp3',
    'audio/mpeg',
    'application/docx',
    'application/pptx',
    'application/xlsx',
    'application/txt',
  ];
  return supportedTypes.includes(fileType);
};

export const findFileType = (fileType) => {
  const uniqueTypes = {
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'application/docx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'application/pptx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/xlsx',
    'text/plain': 'application/txt',
  };
  return uniqueTypes[fileType] || fileType;
};

export const typeArray = [
  {
    type: 'txt',
    icon: 'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1614060786/ba31ac1ab88b5c17cc84283621a6e702_m4cirp.png',
  },
  {
    type: 'folder',
    icon: 'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1614057434/folder-icon_uv8y4m.png',
  },
  {
    type: 'webapp',
    icon: 'https://res.cloudinary.com/drolmjcot/image/upload/v1615476171/web-app-icon-7_pkp4ya.png',
  },
  {
    type: 'other',
    icon: 'https://res.cloudinary.com/drolmjcot/image/upload/v1615477432/add-file_whluwf.png',
  },
];

export const wallpapers = [
  'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1613837593/wallpaper_goadao.jpg',
  'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1617892120/ink_clots_abstraction_203059_1920x1200_tgyguh.jpg',
];

export const getLayout = (fullScreen, screenState) => {
  if (fullScreen)
    return {
      width: '100vw',
      height:
        screenState.screenHeight -
        4.8 * (screenState.screenWidth > 415 ? 10 : 7) -
        4 * (screenState.screenWidth > 415 ? 10 : 7) +
        'px',
    };
  else if (screenState.mobileView) return { width: '90vw', height: '60vh' };
  else return { width: '65vw', height: '70vh' };
};

export const fadeinTop = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.15,
    },
  },
  exit: {
    y: 10,
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

export const slideOutLeft = {
  initial: { x: 100, opacity: 0, scale: 0.97 },
  visible: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
};

export const textTruncate = (str, targetLength) => {
  if (str.length <= targetLength) return str;
  return str.slice(0, targetLength - 3) + '...';
};
