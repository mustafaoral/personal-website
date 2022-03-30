const Enumerable = require("linq");
const Hashids = require("hashids/cjs");
const Image = require("@11ty/eleventy-img");
const path = require("path");

class Photo {
  constructor({ filename, comments, equipment, captureDetails, tags, location } = {}) {
    this.filename = filename;
    this.comments = comments;
    this.equipment = equipment;
    this.captureDetails = captureDetails;
    this.tags = tags;
    this.metadataFull = {};
    this.metadataThumbnail = {};
    this.location = location;

    this.hash = new Hashids(filename, 5).encode(1);
  }
}

const equipment = {
  cameras: {
    "nikon": "Nikon D300",
    "pixel": "Google Pixel XL"
  },
  lenses: {
    "nikon": "Nikon 24-70mm f/2.8",
    "tokina": "Tokina 11-16mm f/2.8",
    "pentaxReversed": "Pentax 50mm f/1.7 (reversed)",
  },
  flash: "Nikon SB-25",
  trigger: "Yongnuo RF-602",
  bellows: {
    ebay: "Cheap eBay bellows",
    nikon: "Nikon PB-5"
  }
}

const compositePhotoComment = "Composite of two exposures.";

const photos = Enumerable.from([
  new Photo({
    filename: "D300-2009-03-04-DSC0741.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 66, exposure: "8000", aperture: 4, iso: 100 }],
    tags: ["abstract", "square"]
  }),

  new Photo({
    filename: "D300-2009-03-12-DSC1114.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 70, exposure: "1/5", aperture: 8, iso: 100 }],
    tags: ["abstract", "square"]
  }),

  new Photo({
    filename: "D300-2009-03-22-DSC1666.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 70, exposure: "1/320", aperture: 4, iso: 800 }],
    tags: ["macro"]
  }),

  new Photo({
    filename: "D300-2009-04-09-DSC2478.jpg",
    comments: ["Colour provided by a marzipan Ritter Sport."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.pentaxReversed, bellows: equipment.bellows.ebay },
    captureDetails: [{ exposure: "1/60", iso: 100 }],
    tags: ["macro", "square"]
  }),

  new Photo({
    filename: "D300-2009-04-12-DSC2608.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 70, exposure: "1/400", aperture: 4, iso: 200 }],
    location: { sexagesimal: `51°13'59.8"N 0°37'30.3"W`, decimal: "51.233285,-0.625088" },
    tags: ["black & white", "landscape", "square"]
  }),

  new Photo({
    filename: "D300-2009-04-12-DSC2611.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 24, exposure: "1/1000", aperture: 4, iso: 200 }],
    location: { sexagesimal: `51°14'04.8"N 0°37'53.4"W`, decimal: "51.234676,-0.631487" },
    tags: ["black & white", "landscape", "square"]
  }),

  new Photo({
    filename: "D300-2009-04-12-DSC2660.jpg",
    comments: [
      "I like how all the grass around this spot is reflected on the water drop.",
      "First experiments with using bellows. This was handheld, hence the high ISO and grainy image."
    ],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.pentaxReversed, bellows: equipment.bellows.ebay },
    captureDetails: [{ exposure: "1/250", iso: 1600 }],
    location: { sexagesimal: `51°13'59.6"N 0°37'33.3"W`, decimal: "51.233234,-0.625903" },
    tags: ["macro"]
  }),

  new Photo({
    filename: "D300-2009-08-02-DSC5277.jpg",
    comments: ["Sometimes getting the shot means lying on your stomach on the runway."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 24, exposure: "1/3200", aperture: 2.8, iso: 200 }],
    location: { sexagesimal: `51°11'16.7"N 1°01'17.8"W`, decimal: "51.187972,-1.021597" },
    tags: ["aviation", "gliding"]
  }),

  new Photo({
    filename: "D300-2009-08-02-DSC5456.jpg",
    comments: ["I like how the tail of the glider acts a second frame within the photo"],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 24, exposure: "1/1000", aperture: 8, iso: 200 }],
    location: { sexagesimal: `51°11'16.7"N 1°01'17.8"W`, decimal: "51.187972,-1.021597" },
    tags: ["aviation", "gliding"]
  }),

  new Photo({
    filename: "D300-2009-09-13-DSC6201.jpg",
    comments: ["Business end of one of the most beautiful aircraft."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 70, exposure: "1/320", aperture: 8, iso: 200 }],
    location: { sexagesimal: `51°10'58.0"N 1°02'16.3"W`, decimal: "51.182772,-1.037869" },
    tags: ["aviation"]
  }),

  new Photo({
    filename: "D300-2009-09-13-DSC6218.jpg",
    comments: ["Great sunset at Lasham. DB and JR about to land in an ASK 13."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 60, exposure: "1/200", aperture: 8, iso: 200 }],
    location: { sexagesimal: `51°11'00.7"N 1°01'59.3"W`, decimal: "51.183518,-1.033127" },
    tags: ["aviation", "gliding"]
  }),

  new Photo({
    filename: "D300-2009-10-25-DSC6637.jpg",
    comments: ["Dramatic sunset plus smooth shiny fiberglass surfaces equals rim light photo opportunity."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 27, exposure: "1/640", aperture: 8, iso: 100 }],
    location: { sexagesimal: `51°11'18.1"N 1°01'32.7"W`, decimal: "51.188359,-1.025740" },
    tags: ["aviation", "gliding"]
  }),

  new Photo({
    filename: "D300-2009-12-28-DSC7082.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.pentaxReversed, bellows: equipment.bellows.nikon },
    captureDetails: [{ exposure: "1/60", iso: 100 }],
    tags: ["abstract", "macro", "square"]
  }),

  new Photo({
    filename: "D300-2010-01-17-DSC7186.jpg",
    comments: ["Another great sunset at Lasham, another photo opportunity."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 70, exposure: "1/320", aperture: 8, iso: 100 }],
    location: { sexagesimal: `51°11'20.0"N 1°01'53.8"W`, decimal: "51.188882, -1.031608" },
    tags: ["aviation"]
  }),

  new Photo({
    filename: "D300-2010-01-21-DSC7228.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.pentaxReversed, bellows: equipment.bellows.nikon },
    captureDetails: [{ exposure: "1/60", iso: 100 }],
    tags: ["abstract", "macro", "black & white"]
  }),

  new Photo({
    filename: "D300-2010-01-21-DSC7231.jpg",
    comments: ["A teeny-tiny bubble stuck between two other bubbles, on which surfaces you can actually see the reflection."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.pentaxReversed, bellows: equipment.bellows.ebay },
    captureDetails: [{ exposure: "1/60", iso: 100 }],
    tags: ["abstract", "macro", "square"]
  }),

  new Photo({
    filename: "D300-2010-01-27-DSC7407.jpg",
    comments: ["Came out of the camera looking almost exactly like this. Only a couple of lumosity masked curve adjustments were made."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.pentaxReversed, bellows: equipment.bellows.nikon },
    captureDetails: [{ exposure: "1/60", iso: 200 }],
    tags: ["abstract", "macro", "square"]
  }),

  new Photo({
    filename: "D300-2010-01-27-DSC7422.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.pentaxReversed, bellows: equipment.bellows.ebay },
    captureDetails: [{ exposure: "1/60", iso: 100 }],
    tags: ["abstract", "macro", "square"]
  }),

  new Photo({
    filename: "D300-2010-01-27-DSC7427.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.pentaxReversed, bellows: equipment.bellows.nikon },
    captureDetails: [{ exposure: "1/60", iso: 200 }],
    tags: ["abstract", "macro", "square"]
  }),

  new Photo({
    filename: "D300-2010-01-30-DSC7459.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.pentaxReversed, bellows: equipment.bellows.nikon },
    captureDetails: [{ exposure: "1/60", iso: 100 }],
    tags: ["abstract", "macro"]
  }),

  new Photo({
    filename: "D300-2010-08-30-DSC8902.jpg",
    comments: ["Dunsfold 2010."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 70, exposure: "1/400", aperture: 8, iso: 200 }],
    location: { sexagesimal: `51°07'07.6"N 0°31'42.9"W`, decimal: "51.118771,-0.528583" },
    tags: ["aviation"]
  }),

  new Photo({
    filename: "D300-2010-08-30-DSC8980.jpg",
    comments: ["Dunsfold 2010."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 70, exposure: "1/800", aperture: 8, iso: 200 }],
    location: { sexagesimal: `51°07'07.6"N 0°31'42.9"W`, decimal: "51.118771,-0.528583" },
    tags: ["aviation", "black & white"]
  }),

  new Photo({
    filename: "D300-2010-12-02-DSC0020.jpg",
    comments: ["Guildford in snow."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [{ focalLength: 13, exposure: "125", aperture: 8, iso: 100 }],
    location: { sexagesimal: `51°14'37.1"N 0°34'45.8"W`, decimal: "51.243646,-0.579392" },
    tags: ["black & white", "landscape"]
  }),

  new Photo({
    filename: "D300-2010-12-05-DSC0040.jpg",
    comments: [
      "Lasham provided many great sunsets. Here's a 757 visiting the servicing facilities at the airfield. Managed to catch the beacon!",
      "It wasn't easy pulling out the fuselage details from the RAW file considering that I had to expose for the sun, but I think I did a decent job."
    ],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 38, exposure: "1/800", aperture: 8, iso: 100 }],
    location: { sexagesimal: `51°11'19.0"N 1°01'34.9"W`, decimal: "51.188606,-1.026370" },
    tags: ["aviation"]
  }),

  new Photo({
    filename: "D300-2011-01-05-DSC0907.jpg",
    comments: ["Maiden's Tower in Istanbul."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [{ focalLength: 11, exposure: "1.6", aperture: 8, iso: 100 }],
    location: { sexagesimal: `41°01'17.4"N 29°00'23.6"E`, decimal: "41.021493,29.006548" },
    tags: ["landscape"]
  }),

  new Photo({
    filename: "D300-2011-01-18-DSC1075.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.pentaxReversed, bellows: equipment.bellows.nikon },
    captureDetails: [{ exposure: "1/60", iso: 200 }],
    tags: ["abstract", "macro"]
  }),

  new Photo({
    filename: "D300-2011-02-20-DSC1896.jpg",
    comments: ["Probably my best macro photo and definitely my favourite."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.pentaxReversed, bellows: equipment.bellows.nikon, flash: equipment.flash, trigger: equipment.trigger },
    captureDetails: [{ exposure: "1/250", iso: 200 }],
    tags: ["abstract", "black & white", "macro", "square"]
  }),

  new Photo({
    filename: "D300-2011-06-13-vertorama.jpg",
    comments: [compositePhotoComment],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [
      { focalLength: 12, exposure: "30", aperture: 8, iso: 100 },
      { focalLength: 12, exposure: "30", aperture: 8, iso: 100 }
    ],
    location: { sexagesimal: `37°44'47.8"N 27°15'01.7"E`, decimal: "37.746622,27.250472" },
    tags: ["landscape", "vertorama"]
  }),

  new Photo({
    filename: "D300-2011-06-29-vertorama.jpg",
    comments: [compositePhotoComment],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [
      { focalLength: 16, exposure: "1/6", aperture: 8, iso: 100 },
      { focalLength: 16, exposure: "0.3", aperture: 8, iso: 100 }
    ],
    location: { sexagesimal: `37°44'48.3"N 27°15'03.2"E`, decimal: "37.746755,27.250887" },
    tags: ["landscape", "vertorama"]
  }),

  new Photo({
    filename: "D300-2013-05-18-DSC3059.jpg",
    comments: [compositePhotoComment],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [
      { focalLength: 11, exposure: "1/15", aperture: 8, iso: 100 },
      { focalLength: 11, exposure: "1/4", aperture: 8, iso: 100 }
    ],
    location: { sexagesimal: `51°15'20.8"N 0°33'31.3"W`, decimal: "51.255763,-0.558686" },
    tags: ["landscape"]
  }),

  new Photo({
    filename: "D300-2013-07-16-vertorama.jpg",
    comments: [compositePhotoComment],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [
      { focalLength: 16, exposure: "1/20", aperture: 8, iso: 100 },
      { focalLength: 16, exposure: "0.5", aperture: 8, iso: 100 }
    ],
    location: { sexagesimal: `51°13'58.1"N 0°32'52.4"W`, decimal: "51.232809, -0.547882" },
    tags: ["landscape", "vertorama"]
  }),

  new Photo({
    filename: "D300-2013-07-30-vertorama.jpg",
    comments: [
      "Mid summer sunset in a Guildford wheat field.",
      compositePhotoComment
    ],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [
      { focalLength: 11, exposure: "1/10", aperture: 8, iso: 100 },
      { focalLength: 11, exposure: "1.3", aperture: 8, iso: 100 }
    ],
    location: { sexagesimal: `51°13'50.1"N 0°37'08.5"W`, decimal: "51.230583,-0.619028" },
    tags: ["landscape", "vertorama"]
  }),

  new Photo({
    filename: "D300-2014-04-20-DSC4649.jpg",
    comments: [
      "Sunset at Hopi Point in Grand Canyon.",
      compositePhotoComment
    ],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [
      { focalLength: 11, exposure: "1/60", aperture: 6.3, iso: 320 },
      { focalLength: 11, exposure: "1/20", aperture: 6.3, iso: 320 }
    ],
    location: { sexagesimal: `36°04'28.0"N 112°09'18.2"W`, decimal: "36.074442,-112.155050" },
    tags: ["landscape"]
  }),

  new Photo({
    filename: "D300-2014-04-22-DSC4833.jpg",
    comments: ["Orange and blue make such a good colour combination."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [{ focalLength: 11, exposure: "1/320", aperture: 8, iso: 100 }],
    location: { sexagesimal: `35°02'24.2"N 111°02'05.8"W`, decimal: "35.040063,-111.034941" },
    tags: ["landscape"]
  }),

  new Photo({
    filename: "D300-2014-05-04-DSC6250.jpg",
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 62, exposure: "1/2000", aperture: 2.8, iso: 100 }],
    location: { sexagesimal: `37°48'50.4"N 122°28'39.8"W`, decimal: "37.814002,-122.477711" },
    tags: ["abstract", "architecture", "black & white", "square"]
  }),

  new Photo({
    filename: "D300-2014-05-16-DSC6619.jpg",
    comments: [
      "The most amazing sunsets I ever saw were in Maldives.",
      compositePhotoComment
    ],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [
      { focalLength: 11, exposure: "2.5", aperture: 8, iso: 100 },
      { focalLength: 11, exposure: "6", aperture: 8, iso: 100 }
    ],
    location: { sexagesimal: `5°09'40.3"N 73°03'08.5"E`, decimal: "5.161187,73.052347" },
    tags: ["landscape"]
  }),

  new Photo({
    filename: "D300-2014-05-18-DSC6713.jpg",
    comments: [compositePhotoComment],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [
      { focalLength: 11, exposure: "30", aperture: 8, iso: 100 },
      { focalLength: 11, exposure: "30", aperture: 8, iso: 400 },
    ],
    location: { sexagesimal: `5°09'39.7"N 73°03'20.7"E`, decimal: "5.161026,73.055752" },
    tags: ["landscape"]
  }),

  new Photo({
    filename: "D300-2014-05-18-DSC6890.jpg",
    comments: [compositePhotoComment],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [
      { focalLength: 11, exposure: "4", aperture: 8, iso: 100 },
      { focalLength: 11, exposure: "15", aperture: 8, iso: 100 }
    ],
    location: { sexagesimal: `5°09'47.2"N 73°02'58.6"E`, decimal: "5.163097,73.049622" },
    tags: ["landscape"]
  }),

  new Photo({
    filename: "D300-2014-05-19-DSC6898.jpg",
    comments: [compositePhotoComment],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.tokina },
    captureDetails: [
      { focalLength: 11, exposure: "1", aperture: 10, iso: 100 },
      { focalLength: 11, exposure: "6", aperture: 10, iso: 100 }
    ],
    location: { sexagesimal: `5°09'39.7"N 73°03'20.7"E`, decimal: "5.161026,73.055752" },
    tags: ["landscape"]
  }),

  new Photo({
    filename: "D300-2014-07-20-DSC7341.jpg",
    comments: ["Red Arrows departing at the end of Farnborough 2014."],
    equipment: { camera: equipment.cameras.nikon, lens: equipment.lenses.nikon },
    captureDetails: [{ focalLength: 70, exposure: "1/2500", aperture: 8, iso: 250 }],
    location: { sexagesimal: `51°16'03.3"N 0°48'03.1"W`, decimal: "51.267573,-0.800850" },
    tags: ["aviation"]
  }),

  new Photo({
    filename: "IMG_20190213_182805.jpg",
    equipment: { camera: equipment.cameras.pixel },
    captureDetails: [{ focalLength: 4.67, exposure: "1/640", aperture: 2, iso: 50 }],
    location: { sexagesimal: `4°42'24.5"S 55°28'46.0"E`, decimal: "-4.706794,55.479431" },
    tags: ["landscape", "phone"]
  }),

  new Photo({
    filename: "IMG_20190214_061902.jpg",
    equipment: { camera: equipment.cameras.pixel },
    captureDetails: [{ focalLength: 4.67, exposure: "1/180", aperture: 2, iso: 50 }],
    location: { sexagesimal: `4°45'24.1"S 55°28'33.8"E`, decimal: "-4.756702,55.476049" },
    tags: ["landscape", "phone"]
  }),

  new Photo({
    filename: "IMG_20200123_135021.jpg",
    comments: ["Elegant lady."],
    equipment: { camera: equipment.cameras.pixel },
    captureDetails: [{ focalLength: 4.67, exposure: "1/2500", aperture: 2, iso: 50 }],
    location: { sexagesimal: `33°59'22.5"N 117°24'36.1"W`, decimal: "33.989577,-117.410023" },
    tags: ["aviation", "black & white", "square", "phone"]
  }),

  new Photo({
    filename: "IMG_20210628_202322.jpg",
    comments: ["Seaside escape from COVID."],
    equipment: { camera: equipment.cameras.pixel },
    captureDetails: [{ focalLength: 4.67, exposure: "1/320", aperture: 2, iso: 60 }],
    location: { sexagesimal: `50°32'28.9"N 2°27'15.6"W`, decimal: "50.541360,-2.454321" },
    tags: ["landscape", "phone"]
  })
]);

const tags = photos.selectMany(x => x.tags).distinct().orderBy(x => x);

async function transformImage(photo, widths, quality) {
  let photoPath;

  if (process.env.ELEVENTY_ENV == "netlify") {
    photoPath = new URL(photo.filename, process.env["blob_storage_container_photography"]).href;
  }
  else {
    photoPath = path.join(process.env["moss_personal_website_photography_path"], photo.filename);
  }

  return await Image(photoPath, {
    widths: widths,
    outputDir: "./www/assets/photos/",
    urlPath: "/assets/photos/",
    sharpJpegOptions: {
      quality: quality
    },
    sharpWebpOptions: {
      quality: quality
    },
    filenameFormat: function (_, _, width, format, _) {
      return `${photo.hash}-${width}.${format}`;
    }
  });
};

module.exports = async function () {
  for (const photo of photos) {
    photo.metadataFull = await transformImage(photo, [null], 100);
    photo.metadataThumbnail = await transformImage(photo, [200], 95);
  }

  return {
    photos: photos.toArray(),
    tags: tags.toArray(),
    photosByTag: tags.aggregate({}, (accumulate, tag) => {
      accumulate[tag] = photos.where(x => x.tags.indexOf(tag) !== -1).orderBy(x => x.filename).toArray();

      return accumulate;
    })
  };
};
