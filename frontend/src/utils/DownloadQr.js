export const downloadQr = (url,showToast)=>{
    if (!url?.qr) {
      showToast("QR Code not found!", "error");
      return;
    }

    const imageUrl = url.qr;
    const filename = url.title ? `${url.title}.png` : "qr-code.png";

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = blobUrl;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);

        showToast("QR Code downloaded!", "success");
      })
      .catch(() => showToast("Failed to download QR Code.", "error"));
    
  } 