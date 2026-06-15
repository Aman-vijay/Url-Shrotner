export const downloadQr = (canvas, title, showToast) => {
    if (!canvas) {
      showToast("QR Code not available yet!", "error");
      return;
    }

    const dataUrl = canvas.toDataURL("image/png");
    const filename = title ? `${title}.png` : "qr-code.png";

    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    showToast("QR Code downloaded!", "success");
  }
