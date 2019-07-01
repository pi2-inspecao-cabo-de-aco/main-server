//[RICAS] Cliente http

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <errno.h>
#include <stdbool.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>



/* Defines the server port */
#define PORT 3030

/* Server address */
#define SERVER_ADDR "192.168.4.1"


/*
 * Main execution of the client program of our simple protocol
 */
int main(int argc, char *argv[]) {

    /* Server socket */
    struct sockaddr_in server;
    /* Client file deor for the local socket */
    int sockfd;

    int len = sizeof(server);
    int slen;

    char bff[4096];

    if(argc<2){
		printf("Falta argumento !\n");
		printf("Execute: ./cliente 0, 1, 2, 3 ou 4 \n");
		printf("\t0: Stop\n");
		printf("\t1: Pause\n");
		printf("\t2: Para Frente\n");
		printf("\t3: Para tras\n");
		printf("\t4: Automatico (MFL e Câmeras) \n\n");
		exit(0);
	}

	memset(&bff, 0, sizeof(bff));
	sprintf(bff, "%s", argv[1]);
	//bff = argv[1];
	printf("bff = %s\n", bff);



    fprintf(stdout, "Starting Client ...\n");


    /*
     * Creates a socket for the client
     */
    if ((sockfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)) == -1) {
        perror("Error on client socket creation:");
        return EXIT_FAILURE;
    }
    fprintf(stdout, "Client socket created with fd: %d\n", sockfd);


    /* Defines the connection properties */
    memset(&server, 0, sizeof(server)); // Zerando a estrutura de dados
    server.sin_family = AF_INET;
    server.sin_port = htons(PORT);
    server.sin_addr.s_addr = inet_addr(SERVER_ADDR);
    //memset(server.sin_zero, 0x0, 8);


    /* Tries to connect to the server */
    if (connect(sockfd, (struct sockaddr*) &server, len) == -1) {
        perror("Can't connect to server");
        return EXIT_FAILURE;
    }


    /* Receives the presentation message from the server */
    /*if ((slen = recv(sockfd, buffer_in, LEN, 0)) > 0) {
        buffer_in[slen + 1] = '\0';
        fprintf(stdout, "Server says: %s\n", buffer_in);
    }*/

     /* Sends the read message to the server through the socket */
     send(sockfd, &bff, strlen(bff), 0);

    /* Close the connection whith the server */
    close(sockfd);

    fprintf(stdout, "Connection closed\n");

    return 0;
}
