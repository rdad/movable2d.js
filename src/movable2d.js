
(function(ctx){
    
    var Movable2d = function(){
        
        this.add_data_to    = '';
        this.container      = document.body;
    }
    
    // ----- Public
    
    Movable2d.prototype = {
        
        set: function( config ){
            
            this.add_data_to = (config.add_data_to) ? config.add_data_to : '';
            this.container = (config.container) ? config.container : document.body;
            return this;
        },

        apply: function( obj ){
            
            if(!obj || obj.is_movable)    return;
            
            var origin, hook;
            var direction = {run:false, x:0, y:0, v:0};

            // ----- prefix -----
            
            var p = Array.prototype.slice.call(document.defaultView.getComputedStyle(document.body, ""))
                    .join("")
                    .match(/(?:-(moz|webkit|ms|khtml)-)/);
                    
            var prefix_css  = p[0];
            var prefix      = p[1];
            
            hook = (obj.prototype) ? obj.prototype : obj;
            
            if(this.add_data_to != ''){
                origin = hook;
                obj = {};
            }
            
            
            // ----- properties -----
            
            hook.is_movable  = true;
            hook.x           = 0;
            hook.y           = 0;
            hook.r           = 0;
            hook.s           = 1;
            
            if(typeof hook.elem == 'undefined')          hook.elem = document.createElement('div');         
            hook.elem.style.cssText = 'position:absolute; '+prefix_css+'backface-visibility: hidden; '+prefix_css+'transform: translateZ(0);';            
            this.container.appendChild( hook.elem );
            
            var self = hook;
            hook.elem.addEventListener( prefix + 'TransitionEnd', function( e ){ self.on_animation_end( e ) } , false );

            // ----- methods -----
            
            
            
            // --- setters
            
            hook.position = function(x,y){
                this.x = x;
                this.y = y;
                this.render();
                
                return this;
            }
            
            hook.rotation = function( r ){
                this.r = r;
                this.render();
                
                return this;
            }
            
            hook.scale = function( s ){
                this.s = s;
                this.render();
                
                return this;
            }
            
            hook.render = function(){
                this.elem.style[ prefix + 'Transform' ] = 'translate3d('+this.x+'px,'+this.y+'px, 0) rotateZ('+this.r+'deg) scale3d('+this.s+','+this.s+',0)';              
            }
            
            // --- animation
            
            hook.move_to = function(x,y, duration, ease){
                
                window.setTimeout(function (self, p) {
                    
                    self.x = x;
                    self.y = y;

                    self.on_animation_start( p.d, p.e );
                    self.render();
                
                }, 0, this, { x:x, y:y, d:duration, e:ease});
                
                return this;
            }

            hook.transform = function(r,s,duration,ease){

                window.setTimeout(function (self, p) {
                    
                    self.r = p.r;
                    self.s = p.s;

                    self.on_animation_start( p.d, p.e );
                    self.render();  
                
                }, 0, this, { r:r, s:s, d:duration, e:ease});

                return this;
            }
            
            hook.animate = function(x,y,r,s,duration,ease){
                
                window.setTimeout(function (self, p) {
                    
                    self.x = p.x;
                    self.y = p.y;
                    self.r = p.r;
                    self.s = p.s;

                    self.on_animation_start( p.d, p.e );
                    self.render(); 
                
                }, 0, this, {x:x, y:y, r:r, s:s, d:duration, e:ease});
 
                return this;
            }
            
            // --- direction
            
             hook.direction_to = function( x, y, vitesse ){
                
                direction = { run:true, x:x, y:y, v:vitesse };
                this.step_direction();
                this.on_animation_start( 1000 / vitesse, 'linear' );
                this.render();
                
                return this;
            }
            
            hook.direction_stop = function(){
                direction.run = false;
                
                return this;
            }
            
            hook.step_direction = function(){

                this.x += direction.x;
                this.y += direction.y;
                
                return this;
            }
            
            // --- events
            
            hook.on_animation_start = function( d, e ){

                //report('start');
                d = (d) ? d+'ms' : '1s';
                e = (e) ? e : 'ease-in-out';
                this.elem.style[ prefix + 'Transition' ] = prefix_css+'transform '+d+' '+e;
            }
            
            hook.on_animation_end = function( e ){

                //report('end');
                if(direction.run == true){
                    this.step_direction();
                    this.render();               
                }else{
                    this.elem.style[ prefix + 'Transition' ] = null;
                    this.elem.dispatchEvent(new CustomEvent("animation_end", {"detail": {self:this, x:this.x, y:this.y, r:this.r, s:this.s}}));
                }
            }

            // ----------------------------------
            
            if(this.add_data_to != ''){
                origin[this.add_data_to] = obj;
            }
            
            return this;
        }
    };
    
    function report( m ){
        console.log( m );
    }

    ctx.movable2d = new Movable2d();
    
})(window);