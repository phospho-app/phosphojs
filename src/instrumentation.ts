import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OpenAIInstrumentation } from '@traceloop/instrumentation-openai';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { BASE_URL } from './config';
require('dotenv').config();

const provider = new NodeTracerProvider(
);

registerInstrumentations({ 
  instrumentations: [
    new OpenAIInstrumentation(),
  ],
 });

  if (!process.env.PHOSPHO_PROJECT_ID) {
    throw new Error("PHOSPHO_PROJECT_ID environment variable is not set");
  }

  if (!process.env.PHOSPHO_API_KEY) {
    throw new Error("PHOSPHO_API_KEY environment variable is not set");
  }

 const traceExporter = new OTLPTraceExporter({ 
    url: `${BASE_URL}/log/${process.env.PHOSPHO_PROJECT_ID}/opentelemetry`,
    headers: { Authorization: `Bearer ${process.env.PHOSPHO_API_KEY}`, 'Content-Type': 'application/json' }
  });
 provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
 provider.register();

 const sdk = new NodeSDK({ traceExporter });

 (async () => {
  try {
    await sdk.start();
    console.log('Phospho initialised...');
  } catch (error) {
    console.error(error);
  }
})();

// For local development to stop the tracing using Control+c
process.on('SIGINT', async () => {
  try {
    await sdk.shutdown();
    console.log('Phospho disconnected.');
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
});