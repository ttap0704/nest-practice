import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    })
  })

  describe('getOne', () => {
    it('should retrun a movie', () => {
      service.create({
        title: 'test movie',
        genres: ['test'],
        year: 2022
      })

      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1)
    })

    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException)
        expect(err.message).toEqual('Movie with ID 999 not found.')
      }
    })
  })

  describe('deleteOne', () => {
    it('delete a movie', () => {
      service.create({
        title: 'test movie',
        genres: ['test'],
        year: 2022
      })

      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;

      expect(afterDelete).toBeLessThan(beforeDelete)
    })

    it('should return a 404', () => {
      try {
        service.deleteOne(999)
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException)
      }
    })
  })

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'test movie',
        genres: ['test'],
        year: 2022
      })
      const afterCreate = service.getAll().length;

      expect(afterCreate).toBeGreaterThan(beforeCreate)
    })
  })

  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        title: 'test movie',
        genres: ['test'],
        year: 2022
      })

      service.update(1, { title: 'updated test movie' })

      const movie = service.getOne(1);

      expect(movie.title).toEqual('updated test movie');
    })

    it('should throw a NotFoundException', () => {
      try {
        service.update(111, { title: 'updated test movie' })
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException)
      }
    })
  })
});
