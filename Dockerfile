FROM debian:latest
MAINTAINER Thomas Thiebaud <thiebaud.tom@gmail.com>

RUN apt-get update
RUN apt-get install -y curl git
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

COPY . /app
WORKDIR /app

ENV NVM_DIR /usr/local/nvm
ENV NVM_SYMLINK_CURRENT true
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash \
    && echo 'source $NVM_DIR/nvm.sh' >> /etc/profile \
    && /bin/bash -l -c "nvm install;" "nvm use;"

ENV PATH $NVM_DIR/current/bin:$PATH
ENV NODE_PATH $NVM_DIR/current/lib/node_modules

RUN npm install

EXPOSE 8080
CMD ["npm", "start"]