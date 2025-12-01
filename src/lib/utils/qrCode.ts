/**
 * QR Code utility functions for download and print operations
 */

interface DownloadQROptions {
  svgElement: SVGElement;
  fileName: string;
}

interface PrintQROptions {
  svgElement: SVGElement;
  businessName?: string;
  url?: string;
}

/**
 * Downloads QR code as PNG image
 * @param options - Download options including SVG element and file name
 */
export const downloadQRCode = ({
  svgElement,
  fileName,
}: DownloadQROptions): void => {
  // Create a canvas and draw the SVG
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Could not get canvas context");
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    // Download as PNG
    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    });
  };

  img.onerror = () => {
    console.error("Failed to load SVG image");
    URL.revokeObjectURL(url);
  };

  img.src = url;
};

/**
 * Opens print dialog for QR code
 * @param options - Print options including SVG element, business name, and URL
 */
export const printQRCode = ({
  svgElement,
  businessName,
  url,
}: PrintQROptions): void => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.error("Could not open print window");
    return;
  }

  const svgClone = svgElement.cloneNode(true) as SVGElement;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print QR Code${businessName ? ` - ${businessName}` : ""}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
          }
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .qr-container {
            text-align: center;
            max-width: 100%;
          }
          h1 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #333;
          }
          svg {
            max-width: 400px;
            width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
          }
          @media print {
            @page {
              margin: 1cm;
              size: auto;
            }
            html, body {
              height: 100%;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="qr-container">
          ${businessName ? `<h1>${businessName}</h1>` : "<h1>QR Code</h1>"}
          ${svgClone.outerHTML}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  // Delay to ensure content is loaded before printing
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
