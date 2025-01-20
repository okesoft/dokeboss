FROM --platform=linux/amd64 node:20.15

RUN apt-get update && \
    apt-get install -y git cmake make pkg-config x265 libtool build-essential \
    curl ffmpeg python3-pip python3-uno ghostscript libatk1.0-0 \
    libatk-bridge2.0-0 libxdamage1 && \
    apt-get clean

RUN python3 -mpip install unoserver --break-system-packages

WORKDIR /usr/src
# Installing png
RUN curl -k -L https://sourceforge.net/projects/libpng/files/libpng16/1.6.45/libpng-1.6.45.tar.gz -o libpng-1.6.45.tar.gz && \
    tar -zxvf libpng-1.6.45.tar.gz && \
    cd libpng-1.6.45/ && \
    ./configure --prefix=/usr/local/libpng && \
    make && \
    make install

# Installing libde265
WORKDIR /usr/src
RUN git clone https://github.com/strukturag/libde265.git && cd libde265/ && ./autogen.sh && ./configure && make && make install

# Installing libheif
WORKDIR /usr/src
RUN git clone https://github.com/strukturag/libheif.git && cd libheif &&  mkdir build && cd build && cmake --preset=release .. && make && make install

RUN export PKG_CONFIG_PATH=/usr/src:/usr/src/libheif:/usr/src/libde265:/usr/src/libpng-1.6.37

WORKDIR /usr/src
RUN git clone --depth 1 --branch 7.1.1-43 https://github.com/ImageMagick/ImageMagick.git && \
    cd ImageMagick && ./configure \
    --with-bzlib=yes \
    --with-djvu=yes \
    --with-dps=yes \
    --with-fftw=yes \
    --with-flif=yes \
    --with-fontconfig=yes \
    --with-fpx=yes \
    --with-freetype=yes \
    --with-gslib=yes \
    --with-gvc=yes \
    --with-heic=yes \
    --with-jbig=yes \
    --with-jemalloc=yes \
    --with-jpeg=yes \
    --with-jxl=yes \
    --with-lcms=yes \
    --with-lqr=yes \
    --with-lzma=yes \
    --with-magick-plus-plus=yes \
    --with-openexr=yes \
    --with-openjp2=yes \
    --with-pango=yes \
    --with-perl=yes \
    --with-png=yes \
    --with-raqm=yes \
    --with-raw=yes \
    --with-rsvg=yes \
    --with-tcmalloc=yes \
    --with-tiff=yes \
    --with-webp=yes \
    --with-wmf=yes \
    --with-x=yes \
    --with-xml=yes \
    --with-zip=yes \
    --with-zlib=yes \
    --with-zstd=yes \
    --with-gcc-arch=native && make -j 8 && make install && ldconfig /usr/local/lib

RUN mkdir -p /app
WORKDIR /app
RUN git clone --depth 1 --branch 1.0.3 https://github.com/okesoft/dokeboss.git .

RUN npm install
RUN npx puppeteer browsers install chrome
RUN npx tsc

ENTRYPOINT ["npm", "run", "serve"]