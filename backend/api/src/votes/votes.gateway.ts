import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import Redis from 'ioredis';

@WebSocketGateway({ cors: true }) // autorise frontend à se connecter
export class VotesGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    const sub = new Redis({ host: process.env.REDIS_HOST || 'localhost' });

    // Abonnement à tous les sondages (pattern poll:* )
    sub.psubscribe('poll:*', (err, count) => {
      if (err) console.error('Redis subscribe error', err);
      else console.log(`📡 Subscribed to ${count} Redis channels`);
    });

    // Quand un vote arrive → redis envoie un message → on broadcast aux clients
    sub.on('pmessage', (pattern, channel, message) => {
      const data = JSON.parse(message);
      console.log('📢 New vote event:', data);
      this.server.emit('poll-results', data);
    });
  }
}
