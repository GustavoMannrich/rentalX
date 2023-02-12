# Cria a imagem do node
FROM node:16

# Seta o diretório
WORKDIR /usr/app

# Copia o package.json pra dentro do WORKDIR
COPY package.json ./

# Instala as dependências
RUN npm install

# Copia tudo pra dentro do WORKDIR
COPY . .

# Expoem a porta 3333
EXPOSE 3333

# Executa a API
CMD ["npm", "run", "dev"]

# Exemplo de criação da imagem
#   docker build -t rentx .

# Exemplo de criação do container:
#   docker run -p 3333:3333 rentx    (vincula a porta 3333 do localhost na porta 3333 do docker )