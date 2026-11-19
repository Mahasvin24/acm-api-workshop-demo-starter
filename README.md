# Your first API

A tiny Express API for ACM at UCSB’s workshop. Make a list of favorite places around campus, then change it into something of your own. All the application code lives in **[server.js](server.js)**.

## Get running

Install [Node.js 22.13 or newer](https://nodejs.org/) and the [Postman desktop app](https://www.postman.com/downloads/). In this folder:

```sh
npm ci
npm start
```

Visit **http://localhost:3001/spots**. You just made a GET request!

`npm run dev` restarts the server when you save a change. `npm test` checks the example routes. Pick a different port with `PORT=4000 npm start` (PowerShell: `$env:PORT=4000; npm start`).

## A request is a small conversation

You send a **method** (what to do), a **URL** (where to do it), and sometimes a **JSON body** (the information to use). The server sends a **status code** and usually some JSON back.

Import **[workshop.postman_collection.json](workshop.postman_collection.json)** into Postman. The collection includes this API and the shared directory. Or make these requests yourself:

| Method | URL | JSON body | What happens |
| --- | --- | --- | --- |
| GET | `http://localhost:3001/spots` | None | Read all recommendations |
| POST | `http://localhost:3001/spots` | `{"name":"The lagoon","tip":"Look for herons."}` | Create a recommendation; get `201` and its ID |
| PATCH | `http://localhost:3001/spots/2` | `{"tip":"Bring binoculars."}` | Change the tip of recommendation 2 |
| DELETE | `http://localhost:3001/spots/2` | None | Remove recommendation 2; get `204` |

For POST and PATCH, select **Body → raw → JSON**. Postman sets `Content-Type: application/json`. Use the actual ID returned by POST; IDs keep increasing when you delete something. The collection remembers this ID automatically.

Try sending `{}` to POST. You’ll get a `400` with a useful explanation. A nonexistent ID gives `404`. `200` means a successful read or update. `204` is success without a response body.

**What about PUT?** PUT normally replaces a resource’s complete representation. PATCH changes only part of it. This starter uses PATCH to keep the first exercise small. Implementing PUT is a good extension.

## Make it yours

Start by changing the welcome message and the initial recommendation. Then pick a direction:

- A shared playlist: rename spots to songs and store a title and artist.
- A quote jar: add quotes with POST; return a random one with GET.
- A lunch picker: filter recommendations by budget using `/spots?budget=10`.
- A trivia game: GET a question; POST an answer.

Add one route at a time. Write down which method, URL, body, and response you want before coding it. Keep the existing routes if you want to keep using the included Postman requests.

## Share it with the room

Keep your terminal open. The API already listens on `0.0.0.0`, which means other devices can reach it through your laptop’s network address. **Do not register `0.0.0.0`, `127.0.0.1`, or `localhost`**: those are not your shareable Wi-Fi address.

Find your IPv4 address:

- macOS: System Settings → Wi-Fi → Details → TCP/IP → IP Address. The terminal command `ipconfig getifaddr en0` also works if `en0` is your Wi-Fi interface.
- Windows: run `ipconfig` and find the IPv4 Address under your Wi-Fi adapter.
- Linux: run `ip -4 addr` and look for the address on your wireless interface.

Ask a neighbor to GET `http://YOUR_WIFI_IP:3001/spots` in Postman. Both laptops must be on a network that permits device-to-device traffic. If it doesn’t work, check the IP, port, running terminal, and any OS firewall prompt. Ask the host about the workshop hotspot if campus Wi-Fi isolates devices.

Ask your host for the **directory URL**, then send:

```http
POST http://HOST_WIFI_IP:3000/api/apis
Content-Type: application/json
```

```json
{
  "name": "Campus Picks",
  "creator": "Your name",
  "description": "Good spots around UCSB.",
  "ip": "192.168.1.42",
  "port": 3001
}
```

Replace the name, creator, description, and IP with yours. **The port is a JSON number.** A `201` response includes your registration `id` and a private `edit_token`. Save both; the token only appears once. Your entry will appear on the directory within 10 seconds.

In the Postman collection, edit collection variables: `registry_url` is the host’s URL, `student_ip` is your Wi-Fi address, `creator` is your name, and `api_name` is a unique project name. `student_url` controls the starter requests. `student_port` is the numeric port you register. The registration request saves the registry ID and token for the update and delete examples.

## What this demo keeps simple

Recommendations live in an array and reset when the process restarts. There are no accounts. Anyone who can reach your starter can change its recommendations; use workshop data only. The directory stores its own entries persistently and requires each entry’s edit token for changes.

Both APIs allow cross-origin requests with `Access-Control-Allow-Origin: *`, JSON and bearer-token headers, and OPTIONS preflight. Cookie credentials aren’t used. Browsers can still restrict requests from HTTPS pages to local HTTP addresses; use the Postman desktop app for the workshop.
