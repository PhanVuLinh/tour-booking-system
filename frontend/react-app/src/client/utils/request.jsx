const API_DOMAIN = import.meta.env.VITE_API_URL;

export const get = async (path) => {
  const response = await fetch(API_DOMAIN + path);
  const result = await response.json();
  return result;
}

export const post = async (path, options) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(options)
  })
  const result = await response.json();

  return result;
}


export const del = async (path) => {
  const response = await fetch(API_DOMAIN + path,
    {
      method: "DELETE",
    })
  const result = await response.json();
  return result;
}



export const update = async (path, options) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(options)
  });
  const result = await response.json();
  return result;
}