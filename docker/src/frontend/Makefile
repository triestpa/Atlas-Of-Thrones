NAME = m3hran/aot_frontend
VERSION = 0.1.0
C_NAME = aot_frontend

.PHONY: all build test tag_latest release install clean

all: clean build install

build: 
	docker build -t $(NAME):$(VERSION) .

clean: 
	docker rm -vf $(C_NAME)
	
install:
	docker run -d --name $(C_NAME) $(NAME):$(VERSION)

tag_latest:
	docker tag $(NAME):$(VERSION) $(NAME):latest

release: tag_latest
	@if ! docker images $(NAME) | awk '{ print $$2 }' | grep -q -F $(VERSION); then echo "$(NAME) version $(VERSION) is not yet built. Please run 'make build'"; false; fi
	docker push $(NAME)
	@echo "*** Don't forget to create a tag. git tag rel-$(VERSION) && git push origin rel-$(VERSION)"

