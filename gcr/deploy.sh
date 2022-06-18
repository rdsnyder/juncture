#!/bin/bash

CONFIG='juncture'
GCP_PROJECT='juncture-digital'
GCR_SERVICE=${1:-juncture-webapp}
REGION='us-central1'

MIN_INSTANCE_LIMIT=1

gcloud config configurations activate ${CONFIG}
gcloud config set project ${GCP_PROJECT}
gcloud config set compute/region ${REGION}
gcloud config set run/region ${REGION}

rsync -va ../app.py .
rsync -va ../static .
gcloud builds submit --tag gcr.io/${GCP_PROJECT}/${GCR_SERVICE}
rm -rf app.py static
gcloud beta run deploy ${GCR_SERVICE} \
    --image gcr.io/${GCP_PROJECT}/${GCR_SERVICE} \
    --min-instances ${MIN_INSTANCE_LIMIT} \
    --allow-unauthenticated \
    --platform managed \
    --memory 1Gi
