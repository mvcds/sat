const { expect } = require('chai')
const { commerce } = require('faker')
const { mock, match } = require('sinon')

const Sample = require('./Sample')

describe('Sample', () => {
  describe('File', () => {
    const resultName = commerce.product()
    const file = js('file')
    const pathToSample = directory(file)
    const location = directory()

    const fs = {
      lstatSync: mock().once()
        .withExactArgs(pathToSample)
        .returns({
          isFile: () => true
        })
    }
    const SampleFile = mock().once()
      .withExactArgs(resultName, pathToSample, location, match.object)
      .returns(file)
    const path = {
      parse: mock().once()
        .withExactArgs(pathToSample)
        .returns({ dir: location })
    }

    const sample = Sample(resultName, pathToSample, {
      SampleFile,
      fs,
      path
    })

    it('Identifies the sample as a file', () => fs.lstatSync.verify())
    it('Gets the locaction', () => path.parse.verify())
    it('Creates a SampleFile', () => {
      SampleFile.verify()

      expect(sample).to.equal(file)
    })
  })

  describe('Directory', () => {
    const resultName = commerce.product()
    const pathToSample = directory()
    const location = directory()
    const folder = {}

    const fs = {
      lstatSync: mock().once()
        .withExactArgs(pathToSample)
        .returns({
          isFile: () => false
        })
    }
    const SampleDirectory = mock().once()
      .withExactArgs(resultName, pathToSample, location, match.object)
      .returns(folder)
    const path = {
      parse: mock().once()
        .withExactArgs(pathToSample)
        .returns({ dir: location })
    }

    const sample = Sample(resultName, pathToSample, {
      SampleDirectory,
      fs,
      path
    })

    it('Identifies the sample as a directory', () => fs.lstatSync.verify())
    it('Gets the locaction', () => path.parse.verify())
    it('Creates a SampleDirectory', () => {
      SampleDirectory.verify()

      expect(sample).to.equal(folder)
    })
  })
})
