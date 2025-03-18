import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlRepository } from './repositories/url.repository';
import { VisitLogRepository } from './repositories/visit-log.repository';
import { ShortCodeGenerator } from './utils/short-code.generator';
import { IpGeolocationService } from './services/ip-geolocation.service';

@Module({
  controllers: [UrlController],
  providers: [
    UrlService,
    UrlRepository,
    VisitLogRepository,
    ShortCodeGenerator,
    IpGeolocationService,
  ],
  exports: [UrlService],
})
export class UrlModule {}
