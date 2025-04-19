sudo docker stop wallet-core-nest
sudo docker rm wallet-core-nest
sudo docker buildx build -t wallet-core-nest .
sudo docker run -d --name wallet-core-nest --network=host --restart unless-stopped wallet-core-nest