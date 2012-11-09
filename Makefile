#This makefile assumes you have your tools in a parent directory as follow
# __someparentfoler__
# 	compiler/
# 		compiler.jar
# 	library/
# 		svn checkout of the latest closure library
# 	stylesheets/
# 		cs.jar
# 	templates/
# 		SoyToJsCompiler.jar
# 		soyutils.js
# 		soyutils_usegoog.js
# 	apps/
# 		@yourproject
# 	jsdoc/
# 		plugins/removegoog.js

#change this accoring to your project name/dirname.
APPDIR=$(shell basename `pwd`)
NS=admin
BUILDDIR=build

all: css tpl deps

#write dep file in js/build/
deps:
	python ../../library/closure/bin/build/depswriter.py \
	--root_with_prefix="js ../../../apps/$(APPDIR)/js" \
	--root_with_prefix="../../templates/ ../../../templates" \
	--root_with_prefix="../../third_party/ ../../../third_party" \
	--output_file="$(BUILDDIR)/deps.js"


#compile file from js/templates/ to js/build/
tpl:
	java -jar ../../templates/SoyToJsSrcCompiler.jar \
	--shouldProvideRequireSoyNamespaces \
	--codeStyle concat \
	--cssHandlingScheme GOOG \
	--outputPathFormat 'js/tmp/{INPUT_FILE_NAME_NO_EXT}.soy.js' \
	js/templates/*.soy

#create CSS file for namespace and put name mapping in js/build/
css:
	java -jar ../../stylesheets/cs.jar \
	--allowed-non-standard-function color-stop \
	--output-file $(BUILDDIR)/$(NS).css \
	--output-renaming-map-format CLOSURE_UNCOMPILED \
	--rename NONE \
	--pretty-print \
	--output-renaming-map $(BUILDDIR)/$(NS)-cssmap.js \
	gss/*.gss \
	gss/$(NS)/*.gss


cssbuild:
	java -jar ../../stylesheets/cs.jar \
	--allowed-non-standard-function color-stop \
	--output-file $(BUILDDIR)/$(NS).css \
	--output-renaming-map-format CLOSURE_COMPILED \
	--rename CLOSURE \
	--output-renaming-map $(BUILDDIR)/cssmap-build.js \
	gss/base.gss \
	gss/$(NS)/*.gss

cssdebug:
	java -jar ../../stylesheets/cs.jar \
	--allowed-non-standard-function color-stop \
	--output-file $(BUILDDIR)/$(NS).css \
	--output-renaming-map-format CLOSURE_COMPILED \
	--rename NONE \
	--output-renaming-map $(BUILDDIR)/cssmap-build.js \
	gss/base.gss \
	gss/$(NS)/*.gss


compile: cssbuild
	python ../../library/closure/bin/build/closurebuilder.py \
	-n $(NS) \
	--root=js/ \
	--root=../../templates/ \
	--root=../../library/ \
	--root=../../third_party/ \
	-o compiled \
	-c ../../compiler/compiler.jar \
	-f --flagfile=js/build-options.ini \
	-f --create_source_map=$(NS).build.js.map \
	-f --output_wrapper="%output% ////@ sourceMappingURL=$(NS).build.js.map" \
	--output_file=$(BUILDDIR)/$(NS).build.js
	rm $(BUILDDIR)/cssmap-build.js

debug: cssdebug
	python ../../library/closure/bin/build/closurebuilder.py \
	-n $(NS) \
	--root=js/ \
	--root=../../templates/ \
	--root=../../library/ \
	--root=../../third_party/ \
	-o compiled \
	-c ../../compiler/compiler.jar \
	-f --debug \
	-f --flagfile=js/build-options.ini \
	--output_file=$(BUILDDIR)/$(NS).build.js
	rm $(BUILDDIR)/cssmap-build.js

initproject:
	mkdir -p gss/$(NS) js/templates $(BUILDDIR) assets
	touch js/start.js
	echo "goog.provide('$(NS)')" >> js/$(NS).js
	touch js/templates/base.soy
	touch gss/$(NS)/extra.gss
	touch js/build-options.ini
	echo "--compilation_level=ADVANCED_OPTIMIZATIONS \
		--warning_level=VERBOSE \
		--use_types_for_optimization \
		--js=build/cssmap-build.js \
		--externs=../../externs/webkit_console.js" > js/build-options.ini
	touch gss/base.gss
	touch index.html


.PHONY: tpl css cssbuild deps all compile

