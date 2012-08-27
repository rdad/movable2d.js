
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
            
            if(!obj)    return;
            
            var origin, hook;
            var direction = {run:false, x:0, y:0, v:0};

            // ----- prefix -----
            
            var p = Array.prototype.slice.call(document.defaultView.getComputedStyle(document.body, ""))
                    .join("")
                    .match(/(?:-(moz|webkit|ms|khtml)-)/);
                    
            var prefix_css  = p[0];
            var prefix      = p[1];
            
            if(this.add_data_to != ''){
                origin = obj;
                obj = {};
            }
            
            // ----- properties -----
            
            obj.is_movable = true;
            
            if(typeof obj.elem == 'undefined')          obj.elem = document.createElement('div');         
            obj.elem.style.cssText = 'position:absolute; '+prefix_css+'backface-visibility: hidden; '+prefix_css+'transform: translateZ(0);';            
            this.container.appendChild( obj.elem );
            
            var self = obj;
            obj.elem.addEventListener( prefix + 'TransitionEnd', function( e ){ self.on_animation_end( e ) } , false );
            
            obj.x = 0;
            obj.y = 0;
            obj.r = 0;
            obj.s = 1;
            
            // ----- methods -----
            
            hook = (obj.prototype) ? obj.prototype : obj;
            
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
                
                this.x = x;
                this.y = y;
                     
                this.on_animation_start( duration, ease );
                this.render();
                
                return this;
            }

            hook.transform = function(r,s,duration,ease){

                this.r = r;
                this.s = s;
                     
                this.on_animation_start( duration, ease );
                this.render();  
                
                return this;
            }
            
            hook.animate = function(x,y,r,s,duration,ease){
                
                this.x = x;
                this.y = y;
                this.r = r;
                this.s = s;
                     
                this.on_animation_start( duration, ease );
                this.render(); 
                
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

                d = (d) ? d+'ms' : '1s';
                e = (e) ? e : 'ease-in-out';
                this.elem.style[ prefix + 'Transition' ] = prefix_css+'transform '+d+' '+e;
            }
            
            hook.on_animation_end = function( e ){

                if(direction.run == true){
                    this.step_direction();
                    this.render();               
                }else{
                    this.elem.style[ prefix + 'Transition' ] = null; 
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