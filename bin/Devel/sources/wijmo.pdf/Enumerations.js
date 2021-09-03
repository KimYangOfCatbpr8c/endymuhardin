var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        // Must follow the PDFKit's _CAP_STYLES object.
        /**
        * Specifies the shape that shall be used at the ends of open subpaths
        * (and dashes, if any) when they are stroked.
        */
        (function (PdfLineCapStyle) {
            /**
            * The stroke is squared off at the endpoint of the path.
            */
            PdfLineCapStyle[PdfLineCapStyle["Butt"] = 0] = "Butt";
            /**
            * A semicircular arc with a diameter equal to the line width is
            * drawn around the endpoint and is filled in.
            */
            PdfLineCapStyle[PdfLineCapStyle["Round"] = 1] = "Round";
            /**
            * The stroke continues beyond the endpoint of the path for a
            * distance equal to the half of the line width and is squared off.
            */
            PdfLineCapStyle[PdfLineCapStyle["Square"] = 2] = "Square";
        })(pdf.PdfLineCapStyle || (pdf.PdfLineCapStyle = {}));
        var PdfLineCapStyle = pdf.PdfLineCapStyle;
        // Must follow the PDFKit's _JOIN_STYLES object.
        /**
        * Specifies the shape to be used at the corners of paths that are stroked.
        */
        (function (PdfLineJoinStyle) {
            /**
            * The outer edges of the strokes for the two segments are extended
            * until they meet at an angle.
            */
            PdfLineJoinStyle[PdfLineJoinStyle["Miter"] = 0] = "Miter";
            /**
            * An arc of a circle with a diameter equal to the line width is drawn
            * around the point where the two segments meet.
            */
            PdfLineJoinStyle[PdfLineJoinStyle["Round"] = 1] = "Round";
            /**
            * The two segments are finished with butt caps and the resulting notch
            * beyond the ends of the segments is filled with a triangle.
            */
            PdfLineJoinStyle[PdfLineJoinStyle["Bevel"] = 2] = "Bevel";
        })(pdf.PdfLineJoinStyle || (pdf.PdfLineJoinStyle = {}));
        var PdfLineJoinStyle = pdf.PdfLineJoinStyle;
        /**
        * Specifies a rule that determines if a point falls inside the enclosed path.
        */
        (function (PdfFillRule) {
            /**
            * Non-zero rule.
            */
            PdfFillRule[PdfFillRule["NonZero"] = 0] = "NonZero";
            /**
            * Even-odd rule.
            */
            PdfFillRule[PdfFillRule["EvenOdd"] = 1] = "EvenOdd";
        })(pdf.PdfFillRule || (pdf.PdfFillRule = {}));
        var PdfFillRule = pdf.PdfFillRule;
        /**
        * Specifies the page orientation.
        */
        (function (PdfPageOrientation) {
            /**
            * Portrait orientation.
            */
            PdfPageOrientation[PdfPageOrientation["Portrait"] = 0] = "Portrait";
            /**
            * Landscape orientation.
            */
            PdfPageOrientation[PdfPageOrientation["Landscape"] = 1] = "Landscape";
        })(pdf.PdfPageOrientation || (pdf.PdfPageOrientation = {}));
        var PdfPageOrientation = pdf.PdfPageOrientation;
        /**
        * Specifies the horizontal alignment of the image.
        */
        (function (PdfImageHorizontalAlign) {
            /**
            * Aligns the image to the left edge of the drawing area.
            */
            PdfImageHorizontalAlign[PdfImageHorizontalAlign["Left"] = 0] = "Left";
            /**
            * Aligns the image in the middle of the drawing area.
            */
            PdfImageHorizontalAlign[PdfImageHorizontalAlign["Center"] = 1] = "Center";
            /**
            * Aligns the image to the right edge of the drawing area.
            */
            PdfImageHorizontalAlign[PdfImageHorizontalAlign["Right"] = 2] = "Right";
        })(pdf.PdfImageHorizontalAlign || (pdf.PdfImageHorizontalAlign = {}));
        var PdfImageHorizontalAlign = pdf.PdfImageHorizontalAlign;
        /**
        * Specifies the vertical alignment of the image.
        */
        (function (PdfImageVerticalAlign) {
            /**
            * Aligns the image to the top edge of the drawing area.
            */
            PdfImageVerticalAlign[PdfImageVerticalAlign["Top"] = 0] = "Top";
            /**
            * Aligns the image in the middle of the drawing area.
            */
            PdfImageVerticalAlign[PdfImageVerticalAlign["Center"] = 1] = "Center";
            /**
            * Aligns the image to the bottom edge of the drawing area.
            */
            PdfImageVerticalAlign[PdfImageVerticalAlign["Bottom"] = 2] = "Bottom";
        })(pdf.PdfImageVerticalAlign || (pdf.PdfImageVerticalAlign = {}));
        var PdfImageVerticalAlign = pdf.PdfImageVerticalAlign;
        /**
        * Specifies the horizontal alignment of text content.
        */
        (function (PdfTextHorizontalAlign) {
            /**
            * Text is aligned to the left.
            */
            PdfTextHorizontalAlign[PdfTextHorizontalAlign["Left"] = 0] = "Left";
            /**
            * Text is centered.
            */
            PdfTextHorizontalAlign[PdfTextHorizontalAlign["Center"] = 1] = "Center";
            /**
            * Text is aligned to the right.
            */
            PdfTextHorizontalAlign[PdfTextHorizontalAlign["Right"] = 2] = "Right";
            /**
            * Text is justified.
            */
            PdfTextHorizontalAlign[PdfTextHorizontalAlign["Justify"] = 3] = "Justify";
        })(pdf.PdfTextHorizontalAlign || (pdf.PdfTextHorizontalAlign = {}));
        var PdfTextHorizontalAlign = pdf.PdfTextHorizontalAlign;
        // internal, determines the baseline of the text.
        (function (_PdfTextBaseline) {
            _PdfTextBaseline[_PdfTextBaseline["Top"] = 0] = "Top";
            _PdfTextBaseline[_PdfTextBaseline["Alphabetic"] = 1] = "Alphabetic";
        })(pdf._PdfTextBaseline || (pdf._PdfTextBaseline = {}));
        var _PdfTextBaseline = pdf._PdfTextBaseline;
        // Names must strictly follow the PDFKit's SIZES object.
        /**
        * Specifies the page size, in points.
        */
        (function (PdfPageSize) {
            /**
            * Represents the A0 page size.
            */
            PdfPageSize[PdfPageSize["A0"] = 0] = "A0";
            /**
            * Represents the A1 page size.
            */
            PdfPageSize[PdfPageSize["A1"] = 1] = "A1";
            /**
            * Represents the A2 page size.
            */
            PdfPageSize[PdfPageSize["A2"] = 2] = "A2";
            /**
            * Represents the A3 page size.
            */
            PdfPageSize[PdfPageSize["A3"] = 3] = "A3";
            /**
            * Represents the A4 page size.
            */
            PdfPageSize[PdfPageSize["A4"] = 4] = "A4";
            /**
            * Represents the A5 page size.
            */
            PdfPageSize[PdfPageSize["A5"] = 5] = "A5";
            /**
            * Represents the A6 page size.
            */
            PdfPageSize[PdfPageSize["A6"] = 6] = "A6";
            /**
            * Represents the A7 page size.
            */
            PdfPageSize[PdfPageSize["A7"] = 7] = "A7";
            /**
            * Represents the A8 page size.
            */
            PdfPageSize[PdfPageSize["A8"] = 8] = "A8";
            /**
            * Represents the A9 page size.
            */
            PdfPageSize[PdfPageSize["A9"] = 9] = "A9";
            /**
            * Represents the A10 page size.
            */
            PdfPageSize[PdfPageSize["A10"] = 10] = "A10";
            /**
            * Represents the B0 page size.
            */
            PdfPageSize[PdfPageSize["B0"] = 11] = "B0";
            /**
            * Represents the B1 page size.
            */
            PdfPageSize[PdfPageSize["B1"] = 12] = "B1";
            /**
            * Represents the B2 page size.
            */
            PdfPageSize[PdfPageSize["B2"] = 13] = "B2";
            /**
            * Represents the B3 page size.
            */
            PdfPageSize[PdfPageSize["B3"] = 14] = "B3";
            /**
            * Represents the B4 page size.
            */
            PdfPageSize[PdfPageSize["B4"] = 15] = "B4";
            /**
            * Represents the B5 page size.
            */
            PdfPageSize[PdfPageSize["B5"] = 16] = "B5";
            /**
            * Represents the B6 page size.
            */
            PdfPageSize[PdfPageSize["B6"] = 17] = "B6";
            /**
            * Represents the B7 page size.
            */
            PdfPageSize[PdfPageSize["B7"] = 18] = "B7";
            /**
            * Represents the B8 page size.
            */
            PdfPageSize[PdfPageSize["B8"] = 19] = "B8";
            /**
            * Represents the B9 page size.
            */
            PdfPageSize[PdfPageSize["B9"] = 20] = "B9";
            /**
            * Represents the B10 page size.
            */
            PdfPageSize[PdfPageSize["B10"] = 21] = "B10";
            /**
            * Represents the C0 page size.
            */
            PdfPageSize[PdfPageSize["C0"] = 22] = "C0";
            /**
            * Represents the C1 page size.
            */
            PdfPageSize[PdfPageSize["C1"] = 23] = "C1";
            /**
            * Represents the C2 page size.
            */
            PdfPageSize[PdfPageSize["C2"] = 24] = "C2";
            /**
            * Represents the C3 page size.
            */
            PdfPageSize[PdfPageSize["C3"] = 25] = "C3";
            /**
            * Represents the C4 page size.
            */
            PdfPageSize[PdfPageSize["C4"] = 26] = "C4";
            /**
            * Represents the C5 page size.
            */
            PdfPageSize[PdfPageSize["C5"] = 27] = "C5";
            /**
            * Represents the C6 page size.
            */
            PdfPageSize[PdfPageSize["C6"] = 28] = "C6";
            /**
            * Represents the C7 page size.
            */
            PdfPageSize[PdfPageSize["C7"] = 29] = "C7";
            /**
            * Represents the C8 page size.
            */
            PdfPageSize[PdfPageSize["C8"] = 30] = "C8";
            /**
            * Represents the C9 page size.
            */
            PdfPageSize[PdfPageSize["C9"] = 31] = "C9";
            /**
            * Represents the C10 page size.
            */
            PdfPageSize[PdfPageSize["C10"] = 32] = "C10";
            /**
            * Represents the RA0 page size.
            */
            PdfPageSize[PdfPageSize["RA0"] = 33] = "RA0";
            /**
            * Represents the RA1 page size.
            */
            PdfPageSize[PdfPageSize["RA1"] = 34] = "RA1";
            /**
            * Represents the RA2 page size.
            */
            PdfPageSize[PdfPageSize["RA2"] = 35] = "RA2";
            /**
            * Represents the RA3 page size.
            */
            PdfPageSize[PdfPageSize["RA3"] = 36] = "RA3";
            /**
            * Represents the RA4 page size.
            */
            PdfPageSize[PdfPageSize["RA4"] = 37] = "RA4";
            /**
            * Represents the SRA0 page size.
            */
            PdfPageSize[PdfPageSize["SRA0"] = 38] = "SRA0";
            /**
            * Represents the SRA1 page size.
            */
            PdfPageSize[PdfPageSize["SRA1"] = 39] = "SRA1";
            /**
            * Represents the SRA2 page size.
            */
            PdfPageSize[PdfPageSize["SRA2"] = 40] = "SRA2";
            /**
            * Represents the SRA3 page size.
            */
            PdfPageSize[PdfPageSize["SRA3"] = 41] = "SRA3";
            /**
            * Represents the SRA4 page size.
            */
            PdfPageSize[PdfPageSize["SRA4"] = 42] = "SRA4";
            /**
            * Represents the executive page size.
            */
            PdfPageSize[PdfPageSize["Executive"] = 43] = "Executive";
            /**
            * Represents the folio page size.
            */
            PdfPageSize[PdfPageSize["Folio"] = 44] = "Folio";
            /**
            * Represents the legal page size.
            */
            PdfPageSize[PdfPageSize["Legal"] = 45] = "Legal";
            /**
            * Represents the letter page size.
            */
            PdfPageSize[PdfPageSize["Letter"] = 46] = "Letter";
            /**
            * Represents the tabloid page size.
            */
            PdfPageSize[PdfPageSize["Tabloid"] = 47] = "Tabloid";
        })(pdf.PdfPageSize || (pdf.PdfPageSize = {}));
        var PdfPageSize = pdf.PdfPageSize;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Enumerations.js.map