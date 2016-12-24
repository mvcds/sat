const dependencies = {
  path: require('path'),
  fs: require('fs')
}

const ReadDirectory = (original, injection) => {
  const { fs } = Object.assign({}, dependencies, injection)

  return new Promise((resolve) => {
    fs.readdir(original, 'utf8', (e, files) => resolve(files))
  })
}

const ReadFiles = (original, target, injection) => {
  return (files) => {
    const samples = files.map(CreateSample(original, target, injection))

    return Promise.all(samples)
  }
}

const CreateSample = (original, target, injection) => {
  const recursiveDependency = {
    Sample: require('./Sample')
  }
  const { path, Sample } = Object.assign({}, dependencies, recursiveDependency, injection)

  return (file) => {
    const { name, ext } = path.parse(file)
    const fileName = name + ext

    const originalPath = path.join(original, fileName)

    const sample = Sample(fileName, originalPath, target, injection)

    return Promise.resolve(sample)
  }
}

module.exports = (folderName, original, folderPath, injection) => {
  const { path } = Object.assign({}, dependencies, injection)

  const target = path.join(folderPath, folderName)

  return ReadDirectory(original, injection)
    .then(ReadFiles(original, target, injection))
}