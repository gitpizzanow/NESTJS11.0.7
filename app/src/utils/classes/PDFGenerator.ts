import * as PDFDocument from 'pdfkit';

export default class PDFGenerator {
  doc = null;
  page_count = 1;

  buffer = [];

  DOC_OPTIONS = {
    width: 595.28, // A4
    height: 841.89, // A4
    top_margin: 50,
    bottom_margin: 50,
    left_margin: 50,
    right_margin: 50,
  };

  colors = {
    primary: 'blue',
    secondary: 'green',
    default: 'black',
  };

  createDocument() {
    this.doc = new PDFDocument({
      bufferPages: true,
      size: [this.DOC_OPTIONS.width, this.DOC_OPTIONS.height],
      margins: {
        top: this.DOC_OPTIONS.top_margin,
        bottom: this.DOC_OPTIONS.bottom_margin,
        left: this.DOC_OPTIONS.left_margin,
        right: this.DOC_OPTIONS.right_margin,
      },
      layout: 'portrait',
      info: {
        Title: 'skulljs - Export',
        Author: 'skulljs',
      },
      autoFirstPage: false,
    });
    this.doc.on('data', this.buffer.push.bind(this.buffer));
    return this;
  }

  addNewPageListener() {
    this.doc.on('pageAdded', () => {
      // Backup
      const font = this.doc._font;
      const fontSize = this.doc._fontSize;
      const fillColor = this.doc._fillColor;

      // Header
      const string = `Page | ${this.page_count++}`;
      this.doc.y = 40;
      this.doc.x = this.DOC_OPTIONS.width - this.DOC_OPTIONS.right_margin - this.doc.widthOfString(string);
      this.doc.fillColor(this.colors.default).text(string);

      // Reset text writer position and font
      this.doc.y = this.DOC_OPTIONS.top_margin;
      this.doc.x = this.DOC_OPTIONS.left_margin;
      this.doc._font = font;
      this.doc._fontSize = fontSize;
      this.doc._fillColor = fillColor;
    });
    return this;
  }

  newPage() {
    this.doc.addPage();
    return this;
  }

  moveDown(line = 1) {
    this.doc.moveDown(line);
    return this;
  }

  writeTitle(title) {
    this.doc.x = this.DOC_OPTIONS.left_margin;
    this.doc.fillColor(this.colors.primary).fontSize(15).text(title);
    this.doc
      .moveTo(this.DOC_OPTIONS.left_margin, this.doc.y)
      .lineTo(this.DOC_OPTIONS.width - this.DOC_OPTIONS.right_margin, this.doc.y)
      .stroke(this.colors.primary);
    this.moveDown(1);
    return this;
  }

  writeSubtitle(subtitle) {
    this.doc.x = this.DOC_OPTIONS.left_margin;
    this.doc.fillColor(this.colors.primary).fontSize(13).text(subtitle);
    this.doc.moveDown(1);
    return this;
  }

  writeLabelValuePair(label, value, label_width = 0) {
    this.doc.x = this.DOC_OPTIONS.left_margin;
    this.doc.fillColor(this.colors.default).fontSize(11).text(`${label} : `, { continued: true });
    this.doc.x += label_width - this.doc.widthOfString(`${label} : `);
    if (value) {
      this.doc.fillColor(this.colors.default).fontSize(11).text(value);
    }
    return this;
  }

  closeAndGetBytes(): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        this.doc.end();
        this.doc.on('end', () => {
          const data = Buffer.concat(this.buffer);
          resolve(data);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
