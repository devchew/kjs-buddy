import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card } from './entities/card.entity';
import { CardTemplate } from './entities/card-template.entity';
import { CardTemplatesService } from './card-templates.service';
import { CardTemplatesController } from './card-templates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Card, CardTemplate])],
  controllers: [CardsController, CardTemplatesController],
  providers: [CardsService, CardTemplatesService],
  exports: [CardsService, CardTemplatesService],
})
export class CardsModule {}
