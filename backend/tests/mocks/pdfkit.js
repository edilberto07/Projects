const PDFDocument = jest.fn(() => ({
    pipe: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    font: jest.fn().mockReturnThis(),
    fontSize: jest.fn().mockReturnThis(),
    moveDown: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis()
}));

module.exports = PDFDocument; 