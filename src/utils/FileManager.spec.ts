import { FileManager } from './FileManager';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { randomBytes } from 'node:crypto';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { constants, WriteStream } from 'node:fs';
import { access } from 'node:fs/promises';

describe('FileManager', () => {
  let path!: string;

  const data = 'test data';
  const sut = FileManager.Instance;

  beforeEach(() => {
    path = join(tmpdir(), randomBytes(16).toString('hex').substring(16));
  });

  afterEach(() => sut.removeFile(path));

  describe('readFile', () => {
    it('should return the contents of a file', async () => {
      // arrange
      await sut.writeFile(path, data);
      // act
      const result = await sut.readFile(path);
      // assert
      expect(result).toEqual(data);
    });

    it('should return undefined if the file does not exist', async () => {
      // act
      const result = await sut.readFile(path);

      // assert
      expect(result).toBeUndefined();
    });
  });

  describe('writeFile', () => {
    it('should write data to a file', async () => {
      // act
      await sut.writeFile(path, data);
      // assert
      const result = await sut.readFile(path);
      expect(result).toEqual(data);
    });

    it('should rewrite data in a file if exists', async () => {
      // arrange
      const prevData = 'test';
      await sut.writeFile(path, prevData);
      // act
      await sut.writeFile(path, data);
      // assert
      const result = await sut.readFile(path);
      expect(result).toEqual(data);
    });
  });

  describe('removeFile', () => {
    it('should remove the file if it exists', async () => {
      // arrange
      await sut.writeFile(path, data);
      // act
      await sut.removeFile(path);
      // assert
      await expect(access(path, constants.F_OK)).rejects.toThrowError();
    });

    it('should do nothing if the file does not exist', async () => {
      // act
      await sut.removeFile(path);
      // assert
      await expect(access(path, constants.F_OK)).rejects.toThrowError();
    });
  });

  describe('pathExists', () => {
    it('should return true if the file exists', async () => {
      // arrange
      await sut.writeFile(path, data);
      // act
      const result = await sut.pathExists(path);
      // assert
      expect(result).toBeTruthy();
    });

    it('should return false if the file does not exist', async () => {
      // act
      const result = await sut.pathExists(path);
      // assert
      expect(result).toBeFalsy();
    });
  });

  describe('createFolder', () => {
    it('should create the folder if it does not exist', async () => {
      // act
      await sut.createFolder(path);
      // assert
      await expect(access(path, constants.F_OK)).resolves.not.toThrowError();
    });

    it('should do nothing if the folder already exists', async () => {
      // arrange
      await sut.createFolder(path);
      // act
      await sut.createFolder(path);
      // assert
      await expect(access(path, constants.F_OK)).resolves.not.toThrowError();
    });
  });

  describe('createTmpWriteStream', () => {
    it('should create a new write stream', async () => {
      // act
      const stream = await sut.createTmpWriteStream();
      // assert
      expect(stream).toBeInstanceOf(WriteStream);
    });

    it('should create a new temp file', async () => {
      // act
      const stream = await sut.createTmpWriteStream();
      // assert
      await expect(
        access(stream.path, constants.F_OK)
      ).resolves.not.toThrowError();
    });
  });
});
