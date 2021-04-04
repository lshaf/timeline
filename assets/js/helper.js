async function Request(path, data) {
    let headerOpts = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            path: path, 
            data: data
        })
    }

    let req = await fetch(window.location.href, headerOpts);
    return await req.json();
}
